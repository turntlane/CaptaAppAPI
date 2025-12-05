import { SessionType } from '@prisma/client';
export declare class CreateSessionDto {
    sessionType: SessionType;
    createdAt?: string;
    endedAt?: string;
    durationSeconds?: number;
}
