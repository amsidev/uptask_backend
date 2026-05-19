import type { Request, Response } from "express"
import User from "../models/User"
import bcrypt, { hash } from 'bcrypt'
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {


    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            //invalid duplicates 
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('The user had been registerted')
                return res.status(409).json({ error: error.message })
            }

            // user its created
            const user = new User(req.body)

            // hash password
            user.password = await hashPassword(password)
            await user.save()

            //Create Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id;

            //SEND mail
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })


            await Promise.allSettled([user.save(), token.save()])

            res.send('Account created, check your email to confirm it')
        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(401).json({error: error.message})
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            return res.send('Account confirm with succes')

        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }


}