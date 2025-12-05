-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('baseline', 'focus_aid');

-- CreateEnum
CREATE TYPE "BandName" AS ENUM ('phi', 'chi', 'psi');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_type" "SessionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "duration_seconds" DECIMAL(10,2),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signal_data" (
    "id" BIGSERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "channel" SMALLINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "signal_value" DECIMAL(12,6) NOT NULL,

    CONSTRAINT "signal_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_aid_sessions" (
    "session_id" TEXT NOT NULL,
    "difficulty_level" INTEGER,
    "pre_session_info" JSONB,
    "post_session_feedback" JSONB,

    CONSTRAINT "focus_aid_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "focus_aid_attention_scores" (
    "id" BIGSERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "attention_score" DECIMAL(5,4) NOT NULL,
    "is_focused" BOOLEAN,

    CONSTRAINT "focus_aid_attention_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_aid_vibrations" (
    "id" BIGSERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "focus_aid_vibrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baseline_sessions" (
    "session_id" TEXT NOT NULL,
    "focused_start_time" BIGINT,
    "focused_end_time" BIGINT,
    "relaxed_start_time" BIGINT,
    "relaxed_end_time" BIGINT,

    CONSTRAINT "baseline_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "baseline_frequency_bands" (
    "id" BIGSERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "band_name" "BandName" NOT NULL,
    "freq_start" DECIMAL(8,4),
    "freq_end" DECIMAL(8,4),
    "power_avg" DECIMAL(12,6),
    "power_sign" INTEGER,

    CONSTRAINT "baseline_frequency_bands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_sessions_type" ON "sessions"("session_type");

-- CreateIndex
CREATE INDEX "idx_sessions_created" ON "sessions"("created_at");

-- CreateIndex
CREATE INDEX "idx_signal_session" ON "signal_data"("session_id");

-- CreateIndex
CREATE INDEX "idx_signal_timestamp" ON "signal_data"("timestamp");

-- CreateIndex
CREATE INDEX "idx_signal_session_channel" ON "signal_data"("session_id", "channel");

-- CreateIndex
CREATE INDEX "idx_attention_session" ON "focus_aid_attention_scores"("session_id");

-- CreateIndex
CREATE INDEX "idx_attention_timestamp" ON "focus_aid_attention_scores"("timestamp");

-- CreateIndex
CREATE INDEX "idx_vibrations_session" ON "focus_aid_vibrations"("session_id");

-- CreateIndex
CREATE INDEX "idx_bands_session" ON "baseline_frequency_bands"("session_id");

-- CreateIndex
CREATE INDEX "idx_bands_name" ON "baseline_frequency_bands"("band_name");

-- AddForeignKey
ALTER TABLE "signal_data" ADD CONSTRAINT "signal_data_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_aid_sessions" ADD CONSTRAINT "focus_aid_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_aid_attention_scores" ADD CONSTRAINT "focus_aid_attention_scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "focus_aid_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_aid_vibrations" ADD CONSTRAINT "focus_aid_vibrations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "focus_aid_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baseline_sessions" ADD CONSTRAINT "baseline_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baseline_frequency_bands" ADD CONSTRAINT "baseline_frequency_bands_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "baseline_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
