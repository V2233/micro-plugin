export async function getMD5Hash(text: string): Promise<string> {
  //@ts-ignore
  const CryptoJS = await import('crypto-js');
  return CryptoJS.MD5(text).toString();
}
