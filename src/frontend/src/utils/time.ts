export const getTime = () => {
  const hours = new Date().getHours();
  let message = '';
  if (hours <= 9) {
    message = '早上';
  } else if (hours <= 12) {
    message = '上午';
  } else if (hours <= 18) {
    message = '下午';
  } else {
    message = '晚上';
  }
  return message;
};

export const getFormatDate = (date = new Date(), type = 1): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  if (type == 1) return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  if (type == 2) return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  if (hours == 'NaN' || minutes == 'NaN' || seconds == 'NaN') return '';
  if (type == 3) return `${hours}:${minutes}:${seconds}`;
  if (type == 4) return `${year}-${month}-${day}`;
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const calculateYearsDif = (startYear: number) => {
  // 获取2000年1月1日的Date对象
  const startDate = new Date(startYear, 0, 1); // 注意月份是从0开始的，所以0代表1月

  const endDate = new Date();

  // 计算两个日期之间的毫秒差
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();

  // 将毫秒转换为年（基于平均每年有365.25天，每天有86400000毫秒）
  const diffInYears = diffInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);

  return Number(diffInYears.toFixed(3));
};
