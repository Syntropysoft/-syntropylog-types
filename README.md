<p align="center">
  <img src="https://raw.githubusercontent.com/Syntropysoft/syntropylog-examples-/main/assets/syntropyLog-logo.png" alt="SyntropyLog Logo" width="170"/>
</p>

# @syntropylog/types

Shared types for the SyntropyLog ecosystem.

## Version 0.1.1

**New in this version:**
- Added comprehensive serialization types (SerializedData, SerializationResult, etc.)
- Added logging-specific types (LogEntry, LoggerOptions, LoggerDependencies)
- Added metrics types (SerializationMetrics, ComplexityDistribution, etc.)
- Centralized all shared types for better consistency across the ecosystem

## Overview

This package contains the fundamental types used across the SyntropyLog ecosystem. These types are designed to be shared between the main library and future modules like adapters and serializers.

## Installation

```bash
npm install @syntropylog/types
```

## Usage

```typescript
import { 
  JsonValue, 
  LogMetadata, 
  ILogger, 
  IContextManager,
  RedisValue 
} from '@syntropylog/types';

// Use types in your implementations
const metadata: LogMetadata = {
  userId: '123',
  operation: 'create',
  timestamp: Date.now()
};

// Implement interfaces
class MyLogger implements ILogger {
  // Implementation...
}
```

## Available Types

### Base Types
- `JsonValue` - Any value that can be safely serialized to JSON
- `SerializableData` - Union type for all data types that can be serialized

### Logging Types
- `LogMetadata` - Type for log metadata objects
- `LogBindings` - Type for log bindings attached to logger instances
- `LogRetentionRules` - Type for retention rules
- `LogFormatArg` - Type for format arguments
- `LogArguments` - Type for logging method arguments
- `ILogger` - Base interface for logger implementations

### Context Types
- `ContextValue` - Type for values that can be stored in context
- `ContextData` - Type for context data structure
- `ContextConfig` - Type for context configuration options
- `IContextManager` - Base interface for context manager implementations

### Redis Types
- `RedisValue` - Type for Redis values
- `RedisListElement` - Type for Redis list elements
- `RedisSetMember` - Type for Redis set members
- `RedisSortedSetMember` - Type for Redis sorted set members
- `RedisHashValue` - Type for Redis hash field values
- `RedisCommandOptions` - Type for Redis command options

### Serialization Types
- `SerializedData` - Type for serialization result data
- `SerializationContextConfig` - Type for serialization context configuration
- `SanitizationConfig` - Type for sanitization configuration
- `SerializationPipelineContext` - Type for pipeline context
- `SerializationResult` - Type for serialization result
- `SerializationMetadata` - Type for serialization metadata
- `SerializationMetrics` - Type for serialization metrics
- `ComplexityDistribution` - Type for complexity distribution metrics
- `SerializerDistribution` - Type for serializer distribution metrics
- `TimeoutStrategyDistribution` - Type for timeout strategy distribution metrics

### Logging Types
- `LogEntry` - Type for log entry structure
- `LoggerOptions` - Type for logger options
- `LoggerDependencies` - Type for logger dependencies

## Development

```bash
# Build the package
npm run build

# Clean build artifacts
npm run clean
```

## License

MIT 