import { encryptData, generateHMAC } from "@/lib/cryptoClient";
import { NEXT_PUBLIC_ENCRYPTION_KEY, NEXT_PUBLIC_HMAC_KEY } from "./constants";

export const encryptFrontend = async (payload: any) => {

    try {
        // Generate HMAC signature for the raw payload
        const signature = await generateHMAC(payload, NEXT_PUBLIC_HMAC_KEY);

        // Encrypt the JSON-stringified payload using AES-GCM
        const { iv, ciphertext } = await encryptData(
            JSON.stringify(payload),
            NEXT_PUBLIC_ENCRYPTION_KEY
        );

        return { error: null, iv, ciphertext, signature }

    } catch (error) {

        return { error }

    }
}