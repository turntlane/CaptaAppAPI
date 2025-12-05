import { Role } from '@prisma/client';
export interface UserPayload {
    id: string;
    email: string;
    username: string;
    role: Role;
}
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
