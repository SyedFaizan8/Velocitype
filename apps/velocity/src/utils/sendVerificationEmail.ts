import { resend } from "@/lib/resend";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";

export async function sendVerificationEmail(username: string, email: string, url: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@velocitype.syedfaizan.in',
            to: [email],
            subject: 'Password Reset Request | velociType',
            react: ResetPasswordEmail({ resetUrl: url, name: username })
        });

        if (data?.id) return { success: true, message: "Email sent successfully" }
        else throw error

    } catch {
        return { success: false, message: "Failed to send email" }
    }
}