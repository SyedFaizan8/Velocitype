import { decryptData, verifyHMAC } from "@/lib/crypto";
import { NextRequest } from "next/server";

export const decryptBackend = async (req: NextRequest) => {

    const signature = req.headers.get("x-signature");
    if (!signature) {
        return {
            error: "Missing signature",
            status: 403,
        }
    }

    const encryptedBody = await req.json();
    const { data, iv } = encryptedBody;
    if (!data || !iv) {
        return {
            error: "Missing encrypted data or IV",
            status: 400,
        }
    }

    const decryptedStr = decryptData(data, iv);
    const decryptedBody = JSON.parse(decryptedStr);

    if (!verifyHMAC(decryptedBody, signature)) {
        return {
            error: "Tampering detected",
            status: 403,
        }
    }

    return { decryptedBody }
}
