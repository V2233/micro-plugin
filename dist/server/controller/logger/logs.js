function getLatestLog(logs) {
    function parseDateFromFilename(filename) {
        const match = filename.match(/^command\.(\d{4}-\d{2}-\d{2})\.log$/);
        if (match) {
            return new Date(match[1]);
        }
        return null;
    }
    let latestDate = null;
    let latestLog = '';
    for (const log of logs) {
        const date = parseDateFromFilename(log);
        if (date !== null && (latestDate === null || date > latestDate)) {
            latestDate = date;
            latestLog = log;
        }
        else if (date === null && latestDate === null) {
            latestLog = log;
        }
    }
    return latestLog;
}
function parseLog(log) {
    const regex = /^(\[\d+:\d+:\d+.\d+\])\[([A-Z]+?)\](.*)/;
    const match = regex.exec(log);
    if (match && match.length >= 4) {
        const time = match[1];
        const level = match[2];
        const detail = match[3];
        return { time, level, detail };
    }
    else {
        return {
            time: '',
            level: '',
            detail: log,
        };
    }
}

export { getLatestLog, parseLog };
