# layer-logging

[![Build Status](https://travis-ci.org/menendezpoo/layer-logging.svg?branch=master)](https://travis-ci.org/menendezpoo/layer-logging)
[![Coverage Status](https://coveralls.io/repos/github/menendezpoo/layer-logging/badge.svg?branch=master)](https://coveralls.io/github/menendezpoo/layer-logging?branch=master)

## Getting Started in 1 Minute

1) Provides logging levels:
   - `ERROR`
   - `WARN`
   - `INFO`
   - `DEBUG`
   - `TRACE`
   - `SILENT`
2) You can't set the level to `SILENT` (It's special).
3) To use the logger, you instantiate it preferably providing at least one `key`.
4) You can use the static properties `filterIn` and `filterOut` to override the current level.
5) If a key is specified in `filterIn` the log will go out no matter the level.
6) Same with `filterOut`, but if a key is specified on both `in` and `out`, it will be skipped.
7) The only way to echo `SILENT` logs, is by including the `key` in `filterIn`

## Examples
### Create Logger and Use It
```typescript
const logger = new Logger('app');
logger.trace("Hello", "World");
// Prints:
// [2025-01-01T18:04:38.233Z] [INFO]   [APP] Hello World
```

### Log at Different Levels
```typescript
const logger = new Logger('app');
Logger.level = 'INFO';
logger.error('Something happened');         // Will go out
logger.trace('Small bit');                  // Won't go out
logger.silent('Specific debug');            // Will never go out if 'app' is not on Logger.filterIn
```