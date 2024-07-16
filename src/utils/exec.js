export function exec(code) {
    setTimeout(code, 0);
}
export function execSync(code) {
    eval(code);
}
export function execSyncGlobal(code) {
    (new Function(code))();
}
