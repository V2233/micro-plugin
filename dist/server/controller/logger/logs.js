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

export { getLatestLog };
