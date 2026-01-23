import { fileURLToPath } from 'node:url';
console.log(import.meta.url);
console.log(fileURLToPath(new URL('./src/frontend', import.meta.url)));
