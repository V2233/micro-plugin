const State = {};
const SymbolTimeout = Symbol('Timeout');
const SymbolResolve = Symbol('Resolve');
class BasePlugin {
    rule = [];
    priority = 9999;
    event = 'message';
    e;
    reply(msg = '', quote = false, data = {}) {
        if (!this.e?.reply || !msg)
            return false;
        return this.e.reply(msg, quote, data);
    }
    conKey(isGroup = false) {
        if (isGroup && this.e.isGroup) {
            return `${this.e.group_id}`;
        }
        else {
            return `${this.e.user_id}`;
        }
    }
    setContext(type, isGroup = false, time = 120, timeout = '操作超时已取消') {
        const key = this.conKey(isGroup);
        if (!State[key])
            State[key] = {};
        State[key][type] = this.e;
        if (time) {
            State[key][type][SymbolTimeout] = setTimeout(() => {
                if (State[key][type]) {
                    const resolve = State[key][type][SymbolResolve];
                    delete State[key][type];
                    resolve ? resolve(false) : this.reply(timeout, true);
                }
            }, time * 1000);
        }
        return State[key][type];
    }
    getContext(type, isGroup) {
        if (type)
            return State[this.conKey(isGroup)]?.[type];
        return State[this.conKey(isGroup)];
    }
    finish(type, isGroup) {
        const key = this.conKey(isGroup);
        if (State[key]?.[type]) {
            clearTimeout(State[key][type][SymbolTimeout]);
            delete State[key][type];
        }
    }
}
export class Plugin extends BasePlugin {
    name = 'your-plugin';
    dsc = '无';
    task = null;
    namespace = null;
    handler = null;
    group_id;
    groupId;
    user_id;
    userId;
    constructor(init = {}) {
        super();
        const { event, priority = 5000, rule, name, dsc, handler, namespace, task } = init;
        name && (this.name = name);
        dsc && (this.dsc = dsc);
        event && (this.event = event);
        priority && (this.priority = priority);
        task &&
            (this.task = {
                name: task?.name ?? '',
                fnc: task?.fnc ?? '',
                cron: task?.cron ?? ''
            });
        rule && (this.rule = rule);
        if (handler) {
            this.handler = handler;
            this.namespace = namespace || '';
        }
    }
    awaitContext(...args) {
        return new Promise(resolve => (this.setContext('resolveContext', ...args)[SymbolResolve] = resolve));
    }
    resolveContext(context) {
        this.finish('resolveContext');
        context[SymbolResolve](this.e);
    }
}
export const plugin = Plugin;
global.plugin = plugin;
