/**
 * @syntropylog/types - Shared types for SyntropyLog ecosystem
 *
 * This package contains the fundamental types used across the SyntropyLog
 * ecosystem. These types are designed to be shared between the main library
 * and future modules like adapters and serializers.
 */
/**
 * Represents any value that can be safely serialized to JSON.
 * This is a recursive type used to ensure type safety for log metadata.
 */
type JsonValue = string | number | boolean | null | {
    [key: string]: JsonValue;
} | JsonValue[];
/**
 * Union type for all data types that can be serialized
 */
type SerializableData = string | number | boolean | null | undefined | Date | Buffer | SerializableData[] | {
    [key: string]: SerializableData;
} | Map<string, SerializableData> | Set<SerializableData>;
/**
 * Type for log metadata objects that can be passed to logging methods
 */
type LogMetadata = Record<string, JsonValue>;
/**
 * Type for log bindings that are attached to logger instances
 */
type LogBindings = Record<string, JsonValue>;
/**
 * Type for retention rules that can be attached to loggers
 */
type LogRetentionRules = {
    ttl?: number;
    maxSize?: number;
    maxEntries?: number;
    archiveAfter?: number;
    deleteAfter?: number;
    [key: string]: JsonValue | number | undefined;
};
/**
 * Type for format arguments that can be passed to logging methods
 */
type LogFormatArg = string | number | boolean | null | undefined;
/**
 * Helper function to convert unknown error to JsonValue
 */
declare function errorToJsonValue(error: unknown): JsonValue;
/**
 * Type for the arguments that can be passed to logging methods
 * This follows the Pino-like signature: (obj, msg, ...args) or (msg, ...args)
 */
type LogArguments = [LogMetadata, string?, ...LogFormatArg[]] | [string, ...LogFormatArg[]] | [];
/**
 * Type for any object that can be used as metadata
 */
type MetadataObject = Record<string, JsonValue>;
/**
 * Type for values that can be stored in context
 */
type ContextValue = string | number | boolean | null | undefined | Buffer | JsonValue;
/**
 * Type for context data structure
 */
type ContextData = Record<string, ContextValue>;
/**
 * Type for context configuration options
 */
type ContextConfig = {
    correlationIdHeader?: string;
    transactionIdHeader?: string;
    [key: string]: ContextValue;
};
/**
 * Type for context headers used in HTTP requests
 */
type ContextHeaders = Record<string, string>;
/**
 * Type for context callback functions
 */
type ContextCallback = () => void | Promise<void>;
/**
 * Type for logging matrix configuration
 */
type LoggingMatrix = Partial<Record<string, string[]>>;
/**
 * Type for filtered context based on log level
 */
type FilteredContext = Record<string, unknown>;
/**
 * Context object for logging operations
 */
type LogContext = {
    correlationId?: string;
    userId?: string | number;
    sessionId?: string;
    requestId?: string;
    [key: string]: JsonValue | undefined;
};
/**
 * Context for pipeline operations (serialization, sanitization, etc.)
 */
type PipelineContext = {
    correlationId?: string;
    operation?: string;
    metadata?: Record<string, JsonValue>;
    timestamp?: number;
};
/**
 * Context for sanitization operations
 */
type SanitizationContext = {
    sensitiveFields?: string[];
    maskPatterns?: Record<string, string>;
    depth?: number;
    maxDepth?: number;
};
/**
 * Type for Redis values - covers all valid Redis data types
 */
type RedisValue = string | number | boolean | Buffer | null | undefined | RedisValue[] | {
    [key: string]: RedisValue;
};
/**
 * Type for Redis list elements
 */
type RedisListElement = string | number | Buffer | null | undefined;
/**
 * Type for Redis set members
 */
type RedisSetMember = string | number | Buffer;
/**
 * Type for Redis sorted set members with scores
 */
type RedisSortedSetMember = {
    score: number;
    value: RedisValue;
};
/**
 * Type for Redis hash field values
 */
type RedisHashValue = string | number | Buffer;
/**
 * Type for Redis command options
 */
type RedisCommandOptions = {
    [key: string]: JsonValue;
};
/**
 * Type for Redis pipeline operations
 */
type RedisPipelineOperation = {
    command: string;
    args: RedisValue[];
};
/**
 * Type for Redis connection parameters
 */
type RedisConnectionParams = {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    [key: string]: unknown;
};
/**
 * Represents a standard message format that the framework understands.
 * The adapter is responsible for converting the broker-specific message
 * format to this structure, and vice-versa.
 */
interface BrokerMessage {
    /**
     * The actual content of the message. Using `Buffer` is the most flexible
     * approach as it supports any type of serialization (JSON, Avro, Protobuf, etc.).
     */
    payload: Buffer;
    /**
     * Key-value metadata attached to the message.
     * This is where SyntropyLog will inject tracing headers like `correlation-id`.
     */
    headers?: Record<string, string | Buffer>;
}
/**
 * Defines the controls for handling a received message's lifecycle.
 * An instance of this is passed to the user's message handler, allowing them
 * to confirm or reject the message.
 */
interface MessageLifecycleControls {
    /**
     * Acknowledges that the message has been successfully processed.
     * This typically removes the message from the queue.
     */
    ack: () => Promise<void>;
    /**
     * Negatively acknowledges the message, indicating a processing failure.
     * @param requeue - If true, asks the broker to re-queue the message
     * for another attempt. If false (or omitted), the broker might move it to a dead-letter queue
     * or discard it, depending on its configuration.
     */
    nack: (requeue?: boolean) => Promise<void>;
}
/**
 * The signature for the user-provided function that will process incoming messages.
 */
type MessageHandler = (message: BrokerMessage, controls: MessageLifecycleControls) => Promise<void>;
/**
 * The interface that every Broker Client Adapter must implement.
 * This is the "plug" where users will connect their specific messaging clients
 * (e.g., `amqplib`, `kafkajs`).
 */
interface IBrokerAdapter {
    /**
     * Establishes a connection to the message broker.
     */
    connect(): Promise<void>;
    /**
     * Gracefully disconnects from the message broker.
     */
    disconnect(): Promise<void>;
    /**
     * Publishes a message to a specific topic or routing key.
     * @param topic - The destination for the message (e.g., a topic name, queue name, or routing key).
     * @param message - The message to be sent, in the framework's standard format.
     */
    publish(topic: string, message: BrokerMessage): Promise<void>;
    /**
     * Subscribes to a topic or queue to receive messages.
     * @param topic - The source of messages to listen to (e.g., a topic name or queue name).
     * @param handler - The user's function that will be called for each incoming message.
     */
    subscribe(topic: string, handler: MessageHandler): Promise<void>;
}
/**
 * Represents a generic, normalized HTTP request that the framework
 * can understand. The adapter is responsible for converting this to the
 * specific format of the underlying library (e.g., AxiosRequestConfig).
 */
interface AdapterHttpRequest {
    /** The full URL for the request. */
    url: string;
    /** The HTTP method. */
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    /** A record of request headers. */
    headers: Record<string, string | number | string[]>;
    /** The request body, if any. */
    body?: unknown;
    /** A record of URL query parameters. */
    queryParams?: Record<string, any>;
}
/**
 * Represents a generic, normalized HTTP response. The adapter
 * will convert the library-specific response into this format.
 */
interface AdapterHttpResponse<T = any> {
    /** The HTTP status code of the response. */
    statusCode: number;
    /** The response body data. */
    data: T;
    /** A record of response headers. */
    headers: Record<string, string | number | string[]>;
}
/**
 * Represents a generic, normalized HTTP error. The adapter
 * will convert the library-specific error into this format.
 */
interface AdapterHttpError extends Error {
    /** The original request that caused the error. */
    request: AdapterHttpRequest;
    /** The response received, if any. */
    response?: AdapterHttpResponse;
    /** A flag to identify this as a normalized adapter error. */
    isAdapterError: true;
}
/**
 * The interface that every HTTP Client Adapter must implement.
 * This is the "plug" where users will connect their clients.
 */
interface IHttpClientAdapter {
    /**
     * The core method that the SyntropyLog instrumenter needs. It executes an
     * HTTP request and returns a normalized response, or throws a normalized error.
     * @param request The generic HTTP request to execute.
     * @returns A promise that resolves with the normalized response.
     */
    request<T>(request: AdapterHttpRequest): Promise<AdapterHttpResponse<T>>;
}
/**
 * Base interface for logger implementations
 */
interface ILogger {
    trace(message: string, ...args: LogFormatArg[]): void;
    trace(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    debug(message: string, ...args: LogFormatArg[]): void;
    debug(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    info(message: string, ...args: LogFormatArg[]): void;
    info(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    warn(message: string, ...args: LogFormatArg[]): void;
    warn(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    error(message: string, ...args: LogFormatArg[]): void;
    error(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    fatal(message: string, ...args: LogFormatArg[]): void;
    fatal(metadata: LogMetadata, message?: string, ...args: LogFormatArg[]): void;
    child(bindings: LogBindings): ILogger;
}
/**
 * Base interface for context manager implementations
 */
interface IContextManager {
    getCorrelationId(): string | undefined;
    setCorrelationId(id: string): void;
    getTransactionId(): string | undefined;
    setTransactionId(id: string): void;
    getContext(): ContextData;
    setContext(data: ContextData): void;
    getContextValue(key: string): ContextValue;
    setContextValue(key: string, value: ContextValue): void;
    clearContext(): void;
    runWithContext<T>(context: ContextData, fn: () => T | Promise<T>): Promise<T>;
    runWithContext<T>(context: ContextData, fn: () => T): T;
}
/**
 * Type for serialization result data
 * Note: We keep this as 'any' by design as serialized data can be any format
 */
type SerializedData = any;
/**
 * Type for serialization context configuration
 */
type SerializationContextConfig = {
    depth: number;
    maxDepth: number;
    sensitiveFields: string[];
    sanitize: boolean;
    customTimeout?: number;
};
/**
 * Type for sanitization configuration
 */
type SanitizationConfig = {
    sensitiveFields: string[];
    redactPatterns: RegExp[];
    maxStringLength: number;
    enableDeepSanitization: boolean;
};
/**
 * Type for pipeline context
 */
type SerializationPipelineContext = {
    serializationContext: SerializationContextConfig;
    sanitizeSensitiveData: boolean;
    sanitizationContext: SanitizationConfig;
    enableMetrics: boolean;
};
/**
 * Type for step durations in pipeline
 */
type StepDurations = {
    serialization?: number;
    sanitization?: number;
    timeout?: number;
};
/**
 * Type for serialization metadata
 */
type SerializationMetadata = {
    stepDurations?: StepDurations;
    operationTimeout?: number;
    complexity?: string;
    serializer?: string;
    timeoutStrategy?: string;
};
/**
 * Type for serialization result
 */
type SerializationResult = {
    data: SerializedData;
    serializer: string;
    duration: number;
    complexity: string;
    sanitized: boolean;
    success: boolean;
    metadata: SerializationMetadata;
    error?: string;
};
/**
 * Type for complexity distribution metrics
 */
type ComplexityDistribution = {
    low: number;
    medium: number;
    high: number;
};
/**
 * Type for serializer distribution metrics
 */
type SerializerDistribution = Record<string, number>;
/**
 * Type for timeout strategy distribution metrics
 */
type TimeoutStrategyDistribution = Record<string, number>;
/**
 * Type for serialization metrics
 */
type SerializationMetrics = {
    totalSerializations: number;
    successfulSerializations: number;
    failedSerializations: number;
    averageSerializationDuration: number;
    averageOperationTimeout: number;
    maxSerializationDuration: number;
    minSerializationDuration: number;
    complexityDistribution: ComplexityDistribution;
    serializerDistribution: SerializerDistribution;
    timeoutStrategyDistribution: TimeoutStrategyDistribution;
};
/**
 * Type for logger dependencies
 */
type LoggerDependencies = {
    contextManager: unknown;
    serializerRegistry: unknown;
    maskingEngine: unknown;
    syntropyLogInstance: unknown;
};
/**
 * Type for log entry structure
 */
type LogEntry = {
    /** The severity level of the log. */
    level: string;
    /** The main log message, formatted from the arguments. */
    message: string;
    /** The ISO 8601 timestamp of when the log was created. */
    timestamp: string;
    /** Any other properties are treated as structured metadata. */
    [key: string]: any;
};
/**
 * Type for logger options
 */
type LoggerOptions = {
    level?: string;
    serviceName?: string;
    transports?: unknown[];
    bindings?: Record<string, any>;
};

export { errorToJsonValue };
export type { AdapterHttpError, AdapterHttpRequest, AdapterHttpResponse, BrokerMessage, ComplexityDistribution, ContextCallback, ContextConfig, ContextData, ContextHeaders, ContextValue, FilteredContext, IBrokerAdapter, IContextManager, IHttpClientAdapter, ILogger, JsonValue, LogArguments, LogBindings, LogContext, LogEntry, LogFormatArg, LogMetadata, LogRetentionRules, LoggerDependencies, LoggerOptions, LoggingMatrix, MessageHandler, MessageLifecycleControls, MetadataObject, PipelineContext, RedisCommandOptions, RedisConnectionParams, RedisHashValue, RedisListElement, RedisPipelineOperation, RedisSetMember, RedisSortedSetMember, RedisValue, SanitizationConfig, SanitizationContext, SerializableData, SerializationContextConfig, SerializationMetadata, SerializationMetrics, SerializationPipelineContext, SerializationResult, SerializedData, SerializerDistribution, StepDurations, TimeoutStrategyDistribution };
