export function exec(code:string) {
    setTimeout(code,0)
}

export function execSync(code:string) {
    eval(code)
}

export function execSyncGlobal(code:string) {
    (new Function(code))()
}