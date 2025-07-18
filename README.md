# @syntropylog/types

Shared types for the SyntropyLog ecosystem.

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

## Development

```bash
# Build the package
npm run build

# Clean build artifacts
npm run clean
```

## License

MIT 