/**
 * Logger class.
 *  Understand it and use it in 1 minute:
 *  1) Has levels (static property `Logger.level`): ERROR, WARN, INFO, DEBUG, TRACE, SILENT
 *  2) You can't set the level to SILENT
 *  3) To use the logger you have to instantiate it, preferably with a "key"
 *  4) You can use static properties `filterIn` and `filterOut` to circle around the current level.
 *  5) If a key is specified in `filterIn` the log will go out no matter the level.
 *  6) Same with `filterOut`. But if a key is specified on both `in` and `out`, it will be skipped.
 *  7) The only way to echo SILENT logs, is by including the key in `filterIn`
 *
 *  Examples:
 *  a) Create logger and use it
 *  ```
 *  const logger = new Logger('app');
 *  logger.trace("Hello", "World");
 *  // Prints:
 *  // [2025-01-01T18:04:38.233Z] [INFO]   [APP] Hello World
 *  ```
 *  b) Log at different levels
 *  ```
 *  const logger = new Logger('app');
 *  Logger.level = 'INFO';
 *  logger.error('Something happened');         // Will go out
 *  logger.trace('Small bit');                  // Won't go out
 *  logger.silent('Specific debug');            // Will never go out if 'app' is not on Logger.filterIn
 *  ```
 *
 */
export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'SILENT';

export type LogConsumer = (message?: any, ...optionalParams: any[]) => void;

export class Logger{

    // Default level is TRACE
    private static _level: LogLevel = 'TRACE';

    // Static getter
    static get level(): LogLevel{ return Logger._level};

    // Static setter, avoids the level being set to SILENT
    static set level(value: LogLevel){
        if(value === 'SILENT') {
            throw  `Level can't be set to ${value}`;
        }
        this._level = value;
    }

    /**
     * All logs from loggers which keys are here will be skipped.
     */
    static filterOut: string[] = [];

    /**
     * All logs from loggers which keys are here will be printed, event SILENT ones.
     */
    static filterIn: string[] = [];

    /**
     * Global pointers to consumer (functions that print the logs).
     * They output to console by default, but could be redirected.
     */
    static consumers: {[level in LogLevel]: LogConsumer} = {
        ERROR:  console.error,
        WARN:   console.warn,
        INFO:   console.info,
        DEBUG:  console.debug,
        TRACE:  console.log,
        SILENT: console.log
    };

    /**
     * Restores the consumers to the default (console)
     */
    static restoreConsumersToDefaults(){
        Logger.consumers.ERROR = console.error;
        Logger.consumers.WARN = console.warn;
        Logger.consumers.INFO = console.info;
        Logger.consumers.DEBUG = console.debug;
        Logger.consumers.TRACE = console.log;
        Logger.consumers.SILENT = console.log;
    }

    /**
     * Deactivates ALL logging by setting the consumers to these empty functions
     */
    static voidAllConsumers(){
        Logger.consumers.ERROR = () => {};
        Logger.consumers.WARN = () => {};
        Logger.consumers.INFO = () => {};
        Logger.consumers.DEBUG = () => {};
        Logger.consumers.TRACE = () => {};
        Logger.consumers.SILENT = () => {};
    }

    /**
     * Keys of the instance. First key is printed before the message.
     */
    readonly keys: string[];

    constructor( ...keys: string[]){
        this.keys = keys;
    }

    /**
     * Handles printing from convenience methods
     * @param level
     * @param tokens
     */
    private out(level: LogLevel, ...tokens: any){

        let forceIn = false;

        if(this.keys.length > 0) {

            // Discard if filterOut
            if(Logger.filterOut.length > 0) {
                for(let key of this.keys){
                    if(Logger.filterOut.filter(f => f === key).length > 0) {
                        return;
                    }
                }
            }

            // Force in if filterIn
            if(Logger.filterIn.length > 0) {
                for(let key of this.keys){
                    if(Logger.filterIn.filter(f => f === key).length > 0) {
                        forceIn = true;
                        break;
                    }
                }
            }
        }

        if(!forceIn) {
            if(this.levelNumber(level) > this.levelNumber(Logger.level)) {
                return;
            }
        }

        const spaces = level =='WARN' || level =='INFO' ? '  ' : ' ';
        const name = this.keys.length > 0 ? `[${this.keys[0].toUpperCase()}] ` : ``;
        const line = `[${(new Date()).toISOString()}] [${level}] ${spaces}${name}` + tokens.join(' ');

        // Log on the correct consumer
        Logger.consumers[level](line);

    }

    /**
     * Returns a numeric level representation of the log level
     * @param level
     */
    private levelNumber(level: LogLevel): number{
        if(level =='ERROR') {
            return 100;
        }else if(level == 'WARN') {
            return 200;
        }else if(level == 'INFO') {
            return 300;
        }else if(level == 'DEBUG') {
            return 400;
        }else if(level == 'TRACE') {
            return 500;
        }else{
            return 600;
        }
    }

    /**
     * Prints message of type ERROR
     * @param what
     */
    error = (...what: any) =>    this.out('ERROR', ...what);

    /**
     * Prints message of type WARN
     * @param what
     */
    warn = (...what: any) =>     this.out('WARN', ...what);

    /**
     * Prints message of type INFO
     * @param what
     */
    info = (...what: any) =>     this.out('INFO', ...what);

    /**
     * Prints message of type DEBUG
     * @param what
     */
    debug = (...what: any) =>    this.out('DEBUG', ...what);

    /**
     * Prints message of type TRACE
     * @param what
     */
    trace = (...what: any) =>    this.out('TRACE', ...what);

    /**
     * Prints message of type SILENT
     * @param what
     */
    silent = (...what: any) =>    this.out('SILENT', ...what);

}