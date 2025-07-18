/**
 * @syntropylog/types - Shared types for SyntropyLog ecosystem
 *
 * This package contains the fundamental types used across the SyntropyLog
 * ecosystem. These types are designed to be shared between the main library
 * and future modules like adapters and serializers.
 */
/**
 * Helper function to convert unknown error to JsonValue
 */
function errorToJsonValue(error) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack || null,
        };
    }
    return String(error);
}

export { errorToJsonValue };
//# sourceMappingURL=index.mjs.map
