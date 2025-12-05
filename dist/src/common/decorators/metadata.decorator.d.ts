export interface RequestMetadata {
    ip?: string;
    userAgent?: string;
}
export declare const Metadata: (...dataOrPipes: unknown[]) => ParameterDecorator;
