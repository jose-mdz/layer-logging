export declare type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'SILENT';
export declare type LogConsumer = (message?: any, ...optionalParams: any[]) => void;
export declare class Logger {
    private static _level;
    static get level(): LogLevel;
    static set level(value: LogLevel);
    static filterOut: string[];
    static filterIn: string[];
    static consumers: {
        [level in LogLevel]: LogConsumer;
    };
    static restoreConsumersToDefaults(): void;
    static voidAllConsumers(): void;
    readonly keys: string[];
    constructor(...keys: string[]);
    private out;
    private levelNumber;
    error: (...what: any) => void;
    warn: (...what: any) => void;
    info: (...what: any) => void;
    debug: (...what: any) => void;
    trace: (...what: any) => void;
    silent: (...what: any) => void;
}
