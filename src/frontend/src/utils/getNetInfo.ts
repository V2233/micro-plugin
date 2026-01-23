export const getNetworkInfo = () => {
  // 重要：检查浏览器是否支持此API
  //@ts-ignore
  if (navigator?.connection && navigator?.connection?.effectiveType) {
    //@ts-ignore
    const connection = navigator?.connection;
    return {
      // 网络类型：'slow-2g', '2g', '3g', '4g', '5g'
      effectiveType: connection.effectiveType,
      // 估算的下行速度 (Mbps)
      downlink: connection.downlink,
      // 估算的上行速度 (Mbps) - 支持度更差
      uplink: connection.uplink || '未知',
      // 往返时延估计 (ms)
      rtt: connection.rtt,
      // 是否在节约数据模式
      saveData: connection.saveData,
    };
  } else {
    return null;
  }
};
