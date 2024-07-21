function formatDuration(time, format, repair = true) {
    const timeObj = computeTimeObject(time, repair);
    if (typeof format === "function") {
        return format(timeObj);
    }
    if (format === "default") {
        return formatDefault(timeObj);
    }
    if (typeof format === "string") {
        return formatTemplate(format, timeObj);
    }
    return timeObj;
}
function formatDefault(timeObj) {
    const { day, hour, minute, second } = timeObj;
    let result = "";
    if (day > 0) {
        result += `${day}天`;
    }
    if (hour > 0) {
        result += `${hour}小时`;
    }
    if (minute > 0) {
        result += `${minute}分`;
    }
    if (second > 0) {
        result += `${second}秒`;
    }
    return result;
}
function formatTemplate(format, timeObj) {
    const replaceRegexes = [
        { pattern: /dd/g, value: timeObj.day },
        { pattern: /hh/g, value: timeObj.hour },
        { pattern: /mm/g, value: timeObj.minute },
        { pattern: /ss/g, value: timeObj.second }
    ];
    for (const { pattern, value } of replaceRegexes) {
        format = format.replace(pattern, value);
    }
    return format;
}
function padWithZero(num, repair) {
    return repair && num < 10 ? `0${num}` : String(num);
}
function computeTimeObject(time, repair = true) {
    const second = padWithZero(Math.floor(time % 60), repair);
    const minute = padWithZero(Math.floor((time / 60) % 60), repair);
    const hour = padWithZero(Math.floor((time / (60 * 60)) % 24), repair);
    const day = padWithZero(Math.floor(time / (24 * 60 * 60)), repair);
    return {
        day,
        hour,
        minute,
        second
    };
}

export { formatDuration as default };
