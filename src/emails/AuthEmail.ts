import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirm your account',
            text: 'UpTask - Confir your account',
            html: `
                <h1>Confirm your account</h1>

                <p>Hello ${user.name},</p>

                <p>Thank you for creating an UpTask account.</p>

                <p>Please confirm your email address by clicking the link below:</p>

                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>

                <p>If you did not create this account, you can safely ignore this email.</p>

                <p>Your confirmation code is:</p>

                <p><b>${user.token}</b></p>

                <p>This code expires in 10 minutes.</p>
            `
        })
        console.log('mensjae enviado', info.messageId)
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reset Your Password',
            text: `Hello ${user.name},
            We received a request to reset the password for your UpTask account.
            Your verification code is: ${user.token}
            This code expires in 10 minutes.
            If you did not request a password reset, you can safely ignore this email.

            The UpTask Team`,
            html: `
        <h1>Reset Your Password</h1>

        <p>Hello ${user.name},</p>

        <p>We received a request to reset the password for your UpTask account.</p>

        <p>To continue, enter the verification code below:</p>

        <p><b>${user.token}</b></p>
        <p>Reset your password by clicking the link below:</p>

        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>

        <p>This code expires in 10 minutes.</p>

        <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

        <p>For security reasons, do not share this code with anyone.</p>

        <p>Best regards,<br>The UpTask Team</p>
    `
        })
        console.log('mensjae enviado', info.messageId)
    }
}