import { PrismaClient, Role } from "@prisma/client";
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

async function main() {
  console.log("Starting database seed...");

  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing users and refresh tokens");

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

    console.log(
      `Created user: ${user.firstName} ${user.lastName} (${user.email})`
    );
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
