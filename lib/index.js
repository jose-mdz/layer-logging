"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(...keys) {
        this.error = (...what) => this.out('ERROR', ...what);
        this.warn = (...what) => this.out('WARN', ...what);
        this.info = (...what) => this.out('INFO', ...what);
        this.debug = (...what) => this.out('DEBUG', ...what);
        this.trace = (...what) => this.out('TRACE', ...what);
        this.silent = (...what) => this.out('SILENT', ...what);
        this.keys = keys;
    }
    static getLevel() { return Logger._level; }
    ;
    static setLevel(value) {
        if (value === 'SILENT') {
            throw `Level can't be set to ${value}`;
        }
        this._level = value;
    }
    static restoreConsumersToDefaults() {
        Logger.consumers.ERROR = console.error;
        Logger.consumers.WARN = console.warn;
        Logger.consumers.INFO = console.info;
        Logger.consumers.DEBUG = console.debug;
        Logger.consumers.TRACE = console.log;
        Logger.consumers.SILENT = console.log;
    }
    static voidAllConsumers() {
        Logger.consumers.ERROR = () => { };
        Logger.consumers.WARN = () => { };
        Logger.consumers.INFO = () => { };
        Logger.consumers.DEBUG = () => { };
        Logger.consumers.TRACE = () => { };
        Logger.consumers.SILENT = () => { };
    }
    out(level, ...tokens) {
        let forceIn = false;
        if (this.keys.length > 0) {
            if (Logger.filterOut.length > 0) {
                for (let key of this.keys) {
                    if (Logger.filterOut.filter(f => f === key).length > 0) {
                        return;
                    }
                }
            }
            if (Logger.filterIn.length > 0) {
                for (let key of this.keys) {
                    if (Logger.filterIn.filter(f => f === key).length > 0) {
                        forceIn = true;
                        break;
                    }
                }
            }
        }
        if (!forceIn) {
            if (this.levelNumber(level) > this.levelNumber(Logger.getLevel())) {
                return;
            }
        }
        const spaces = level == 'WARN' || level == 'INFO' ? '  ' : ' ';
        const name = this.keys.length > 0 ? `[${this.keys[0].toUpperCase()}] ` : ``;
        const line = `[${(new Date()).toISOString()}] [${level}] ${spaces}${name}` + tokens.join(' ');
        Logger.consumers[level](line);
    }
    levelNumber(level) {
        if (level == 'ERROR') {
            return 100;
        }
        else if (level == 'WARN') {
            return 200;
        }
        else if (level == 'INFO') {
            return 300;
        }
        else if (level == 'DEBUG') {
            return 400;
        }
        else if (level == 'TRACE') {
            return 500;
        }
        else {
            return 600;
        }
    }
}
exports.Logger = Logger;
Logger._level = 'TRACE';
Logger.filterOut = [];
Logger.filterIn = [];
Logger.consumers = {
    ERROR: console.error,
    WARN: console.warn,
    INFO: console.info,
    DEBUG: console.debug,
    TRACE: console.log,
    SILENT: console.log
};
//# sourceMappingURL=index.js.map