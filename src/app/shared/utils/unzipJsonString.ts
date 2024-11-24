import { Buffer } from 'buffer';
import pako from 'pako';

export const decompressData = <T = any>(compressedBase64: ArrayBuffer): T => {
    if (compressedBase64 instanceof ArrayBuffer) {
        const byteArray = compressedBase64;
        // const byteArray = Buffer.from(compressedBase64, 'base64');
        const decompressedData = pako.inflateRaw(byteArray, { to: 'string' });
        const jsonObject = JSON.parse(decompressedData);
        return jsonObject;
    } else {
        return compressedBase64 as T;
    }
    // if (typeof compressedBase64 === 'string') {
    //     const byteArray = compressedBase64 as any;
    //     // const byteArray = Buffer.from(compressedBase64, 'base64');
    //     const decompressedData = pako.inflateRaw(byteArray, { to: 'string' });
    //     const jsonObject = JSON.parse(decompressedData);
    //     return jsonObject;
    // } else {
    //     return compressedBase64 as T;
    // }
};
