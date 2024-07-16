export function getLatestLog(logs: string[]) {
    // 定义一个辅助函数来解析文件名中的日期  
    type parseDateType = number | null | string | Date
    function parseDateFromFilename(filename: string): parseDateType {
        const match = filename.match(/^command\.(\d{4}-\d{2}-\d{2})\.log$/);
        if (match) {
            return new Date(match[1]);
        }
        // 如果文件名不匹配或没有日期，返回null  
        return null;
    }

    // 初始化最新日期和对应的文件名  
    let latestDate: parseDateType = null;
    let latestLog = '';

    // 遍历日志文件名数组  
    for (const log of logs) {
        // 解析当前文件名中的日期  
        const date = parseDateFromFilename(log);

        // 如果当前日期是有效的（即不是null），则比较并更新最新日期和文件名  
        if (date !== null && (latestDate === null || date > latestDate)) {
            latestDate = date;
            latestLog = log;
        }
        // 如果没有日期的文件名且之前没有找到有日期的文件名，则将其作为最新的（但这通常不是期望的）  
        else if (date === null && latestDate === null) {
            latestLog = log;
        }
    }

    // 返回最新日期的日志文件名  
    return latestLog;
}  