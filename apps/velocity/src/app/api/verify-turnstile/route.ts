import { NextResponse } from "next/server";
import axios from "axios";
import { TURNSTILE_SECRET_KEY } from "@/utils/constants";

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        if (!token) return NextResponse.json({ message: "Token is missing." }, { status: 400 });

        const secret = TURNSTILE_SECRET_KEY;
        if (!secret) return NextResponse.json({ message: "Server misconfiguration." }, { status: 500 });

        const params = new URLSearchParams({
            secret,
            response: token,
        });

        const response = await axios.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", params);

        if (response.data.success) {
            return NextResponse.json({ message: "CAPTCHA verified successfully!" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "CAPTCHA verification failed." }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying Turnstile:", error);
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
}
