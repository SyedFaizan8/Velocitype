export async function generateHMAC<T>(payload: T, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, data);
    return bufferToHex(signatureBuffer);
}

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function encryptData(plainText: string, key: string): Promise<{ iv: string; ciphertext: string }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const rawKey = encoder.encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );
    // Generate a random 12-byte IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        data
    );
    return {
        iv: arrayBufferToBase64(iv.buffer),
        ciphertext: arrayBufferToBase64(encryptedBuffer)
    };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }
    return btoa(binary);
}
