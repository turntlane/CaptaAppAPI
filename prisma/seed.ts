// Note: Run `yarn db:generate` first to generate Prisma Client with new models
import { PrismaClient, Role, SessionType, BandName } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");

const sampleUsers = [
  {
    email: "john.doe@example.com",
    username: "johndoe",
    password: "Password123",
    firstName: "John",
    lastName: "Doe",
    age: 28,
    friendsCount: 150,
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: Role.ADMIN,
  },
  {
    email: "jane.smith@example.com",
    username: "janesmith",
    password: "Password123",
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    friendsCount: 89,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "mike.johnson@example.com",
    username: "mikej",
    password: "Password123",
    firstName: "Mike",
    lastName: "Johnson",
    age: 32,
    friendsCount: 203,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "sarah.wilson@example.com",
    username: "sarahw",
    password: "Password123",
    firstName: "Sarah",
    lastName: "Wilson",
    age: 29,
    friendsCount: 67,
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "alex.brown@example.com",
    username: "alexbrown",
    password: "Password123",
    firstName: "Alex",
    lastName: "Brown",
    age: 26,
    friendsCount: 124,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

// Helper function to generate sample signal data
function generateSignalData(
  sessionId: string,
  startTimestamp: bigint,
  durationSeconds: number,
  sampleRate: number = 250
): Array<{
  sessionId: string;
  channel: number;
  timestamp: bigint;
  signalValue: number;
}> {
  const samples = durationSeconds * sampleRate;
  const data: Array<{
    sessionId: string;
    channel: number;
    timestamp: bigint;
    signalValue: number;
  }> = [];

  // Generate data for both channels
  for (let channel = 1; channel <= 2; channel++) {
    for (let i = 0; i < samples; i++) {
      const timestamp = startTimestamp + BigInt(i * (1000 / sampleRate));
      // Generate realistic signal values with some variation
      const baseValue = channel === 1 ? 0.25 : 0.2;
      const variation = (Math.random() - 0.5) * 0.1;
      const signalValue = Number((baseValue + variation).toFixed(6));

      data.push({
        sessionId,
        channel,
        timestamp,
        signalValue,
      });
    }
  }

  return data;
}

// Helper function to generate attention scores
function generateAttentionScores(
  sessionId: string,
  startTimestamp: bigint,
  durationSeconds: number,
  sampleIntervalSeconds: number = 1
): Array<{
  sessionId: string;
  timestamp: bigint;
  attentionScore: number;
  isFocused: boolean | null;
}> {
  const samples = Math.floor(durationSeconds / sampleIntervalSeconds);
  const data: Array<{
    sessionId: string;
    timestamp: bigint;
    attentionScore: number;
    isFocused: boolean | null;
  }> = [];

  for (let i = 0; i < samples; i++) {
    const timestamp = startTimestamp + BigInt(i * sampleIntervalSeconds * 1000);
    // Generate attention scores that vary over time
    const baseScore =
      0.75 + Math.sin(i / 10) * 0.15 + (Math.random() - 0.5) * 0.1;
    const attentionScore = Math.max(
      0,
      Math.min(1, Number(baseScore.toFixed(4)))
    );
    const isFocused =
      attentionScore > 0.7 ? true : attentionScore < 0.5 ? false : null;

    data.push({
      sessionId,
      timestamp,
      attentionScore,
      isFocused,
    });
  }

  return data;
}

async function main() {
  console.log("Starting database seed...");

  // Clear existing data (in reverse order of dependencies)
  await prisma.baselineFrequencyBand.deleteMany();
  await prisma.baselineSession.deleteMany();
  await prisma.focusAidVibration.deleteMany();
  await prisma.focusAidAttentionScore.deleteMany();
  await prisma.focusAidSession.deleteMany();
  await prisma.signalData.deleteMany();
  await prisma.session.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data");

  // Seed users
  let firstUserId: string | null = null;
  for (const userData of sampleUsers) {
    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        friendsCount: userData.friendsCount,
        avatarUrl: userData.avatarUrl,
        role: userData.role ?? Role.USER,
      },
    });

    // Store the first user's ID for session creation
    if (!firstUserId) {
      firstUserId = user.id;
    }

    console.log(
      `Created user: ${user.firstName} ${user.lastName} (${user.email})`
    );
  }

  if (!firstUserId) {
    throw new Error("No users were created");
  }

  // Seed Baseline Test Session
  console.log("\nCreating baseline test session...");
  const baselineSessionId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
  const baselineStartTime = new Date("2024-01-15T10:30:00Z");
  const baselineEndTime = new Date("2024-01-15T10:50:00Z");
  const baselineDuration = 1200.0;

  await prisma.session.create({
    data: {
      id: baselineSessionId,
      userId: firstUserId,
      sessionType: SessionType.baseline,
      createdAt: baselineStartTime,
      endedAt: baselineEndTime,
      durationSeconds: baselineDuration,
      baselineSession: {
        create: {
          focusedStartTime: BigInt(baselineStartTime.getTime()),
          focusedEndTime: BigInt(new Date("2024-01-15T10:40:00Z").getTime()),
          relaxedStartTime: BigInt(new Date("2024-01-15T10:40:00Z").getTime()),
          relaxedEndTime: BigInt(baselineEndTime.getTime()),
          frequencyBands: {
            create: [
              {
                bandName: BandName.phi,
                freqStart: 8.5,
                freqEnd: 12.5,
                powerAvg: 0.045623,
                powerSign: 1,
              },
              {
                bandName: BandName.chi,
                freqStart: 12.5,
                freqEnd: 18.0,
                powerAvg: 0.032145,
                powerSign: 1,
              },
              {
                bandName: BandName.psi,
                freqStart: 4.0,
                freqEnd: 8.0,
                powerAvg: 0.028901,
                powerSign: -1,
              },
            ],
          },
        },
      },
    },
  });

  // Generate signal data for baseline session (sample every 4ms for 250Hz)
  // For seeding, we'll generate a smaller sample (every 40ms = 25Hz) to keep it manageable
  const baselineSignalData = generateSignalData(
    baselineSessionId,
    BigInt(baselineStartTime.getTime()),
    baselineDuration,
    25 // Reduced sample rate for seeding
  );

  // Insert signal data in batches
  const batchSize = 1000;
  for (let i = 0; i < baselineSignalData.length; i += batchSize) {
    const batch = baselineSignalData.slice(i, i + batchSize);
    await prisma.signalData.createMany({
      data: batch,
    });
  }
  console.log(
    `Created ${baselineSignalData.length} signal data points for baseline session`
  );

  // Seed Focus Aid Session
  console.log("\nCreating focus aid session...");
  const focusAidSessionId = "b2c3d4e5-f6a7-8901-bcde-f12345678901";
  const focusAidStartTime = new Date("2024-01-15T14:00:00Z");
  const focusAidEndTime = new Date("2024-01-15T14:25:00Z");
  const focusAidDuration = 1500.0;

  await prisma.session.create({
    data: {
      id: focusAidSessionId,
      userId: firstUserId,
      sessionType: SessionType.focus_aid,
      createdAt: focusAidStartTime,
      endedAt: focusAidEndTime,
      durationSeconds: focusAidDuration,
      focusAidSession: {
        create: {
          difficultyLevel: 3,
          preSessionInfo: {
            user_mood: "calm",
            sleep_hours: 7.5,
            caffeine_intake: 1,
            task_type: "studying",
          },
          postSessionFeedback: {
            satisfaction: 4,
            difficulty_perceived: 3,
            focus_improvement: true,
            notes: "Felt more focused after 10 minutes",
          },
        },
      },
    },
  });

  // Generate attention scores (every second)
  const attentionScores = generateAttentionScores(
    focusAidSessionId,
    BigInt(focusAidStartTime.getTime()),
    focusAidDuration,
    1
  );

  // Insert attention scores in batches
  for (let i = 0; i < attentionScores.length; i += batchSize) {
    const batch = attentionScores.slice(i, i + batchSize);
    await prisma.focusAidAttentionScore.createMany({
      data: batch,
    });
  }
  console.log(`Created ${attentionScores.length} attention scores`);

  // Find timestamps where attention dropped (isFocused = false) for vibrations
  const vibrationTimestamps = attentionScores
    .filter((score) => score.isFocused === false)
    .map((score) => score.timestamp)
    .slice(0, 10); // Limit to 10 vibrations for seeding

  if (vibrationTimestamps.length > 0) {
    await prisma.focusAidVibration.createMany({
      data: vibrationTimestamps.map((timestamp) => ({
        sessionId: focusAidSessionId,
        timestamp,
      })),
    });
    console.log(`Created ${vibrationTimestamps.length} vibration events`);
  }

  // Generate signal data for focus aid session
  const focusAidSignalData = generateSignalData(
    focusAidSessionId,
    BigInt(focusAidStartTime.getTime()),
    focusAidDuration,
    25 // Reduced sample rate for seeding
  );

  // Insert signal data in batches
  for (let i = 0; i < focusAidSignalData.length; i += batchSize) {
    const batch = focusAidSignalData.slice(i, i + batchSize);
    await prisma.signalData.createMany({
      data: batch,
    });
  }
  console.log(
    `Created ${focusAidSignalData.length} signal data points for focus aid session`
  );

  // Seed another Focus Aid Session with more detailed JSONB data
  console.log("\nCreating detailed focus aid session...");
  const detailedSessionId = "c3d4e5f6-a7b8-9012-cdef-123456789012";
  const detailedStartTime = new Date("2024-01-16T09:00:00Z");
  const detailedEndTime = new Date("2024-01-16T09:20:00Z");
  const detailedDuration = 1200.0;

  await prisma.session.create({
    data: {
      id: detailedSessionId,
      userId: firstUserId,
      sessionType: SessionType.focus_aid,
      createdAt: detailedStartTime,
      endedAt: detailedEndTime,
      durationSeconds: detailedDuration,
      focusAidSession: {
        create: {
          difficultyLevel: 2,
          preSessionInfo: {
            user_mood: "focused",
            sleep_hours: 8.0,
            sleep_quality: "good",
            caffeine_intake: 2,
            meals_today: 2,
            task_type: "reading",
            expected_duration_minutes: 20,
            environment: "quiet_office",
            time_of_day: "afternoon",
          },
          postSessionFeedback: {
            satisfaction: 5,
            difficulty_perceived: 2,
            focus_improvement: true,
            vibrations_count: 3,
            average_attention_score: 0.82,
            notes: "Great session, felt very focused throughout",
            would_recommend: true,
            session_rating: 5,
          },
        },
      },
    },
  });

  // Generate attention scores for detailed session
  const detailedAttentionScores = generateAttentionScores(
    detailedSessionId,
    BigInt(detailedStartTime.getTime()),
    detailedDuration,
    2 // Every 2 seconds
  );

  await prisma.focusAidAttentionScore.createMany({
    data: detailedAttentionScores,
  });
  console.log(
    `Created ${detailedAttentionScores.length} attention scores for detailed session`
  );

  // Add vibrations for detailed session
  const detailedVibrations = detailedAttentionScores
    .filter((score) => score.isFocused === false)
    .map((score) => score.timestamp)
    .slice(0, 3);

  if (detailedVibrations.length > 0) {
    await prisma.focusAidVibration.createMany({
      data: detailedVibrations.map((timestamp) => ({
        sessionId: detailedSessionId,
        timestamp,
      })),
    });
    console.log(
      `Created ${detailedVibrations.length} vibration events for detailed session`
    );
  }

  console.log("\nDatabase seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
