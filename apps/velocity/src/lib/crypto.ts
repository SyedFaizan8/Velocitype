import { ENCRYPTION_KEY, HMAC_SECRET } from "@/utils/constants";
import crypto from "crypto";

export function verifyHMAC<T>(payload: T, signature: string): boolean {
    const hmac = crypto.createHmac("sha256", HMAC_SECRET);
    hmac.update(JSON.stringify(payload));
    const digest = hmac.digest("hex");
    return digest === signature;
}

export function decryptData(ciphertextBase64: string, ivBase64: string): string {
    const ciphertextBuffer = Buffer.from(ciphertextBase64, "base64");
    const ivBuffer = Buffer.from(ivBase64, "base64");

    const tagLength = 16;
    const authTag = ciphertextBuffer.subarray(ciphertextBuffer.length - tagLength);
    const encryptedData = ciphertextBuffer.subarray(0, ciphertextBuffer.length - tagLength);

    const keyBuffer = Buffer.from(ENCRYPTION_KEY, "utf8");
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString();
}