type TStdoutListener = (buffer: string | Uint8Array<ArrayBufferLike>) => any;
type TProcessStdoutWrite = (
  str: Uint8Array | string,
  encoding?: BufferEncoding,
  cb?: (err?: Error) => void
) => boolean;

const stdoutSets = new Set<TStdoutListener>();

const originalWrite = process.stdout.write;

// 2. 用自定义函数覆盖它
(process.stdout.write as TProcessStdoutWrite) = function (
  str: Uint8Array | string,
  encoding?: BufferEncoding,
  cb?: (err?: Error) => void
) {
  stdoutSets.forEach(fn => fn(str));

  return originalWrite.call(this, str, encoding, cb);
};

/**
 * 添加stdout监听器
 * @param callback
 * @returns
 */
export const addStdoutListener = (callback: TStdoutListener) => {
  stdoutSets.add(callback);
  return () => stdoutSets.delete(callback);
};
