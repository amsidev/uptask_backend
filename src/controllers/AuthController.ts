import type { Request, Response } from "express"
import User from "../models/User"
import bcrypt, { hash } from 'bcrypt'
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
                name: user.name,
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
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(401).json({ error: error.message })
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            return res.send('Account confirm with succes')

        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User not found')
                return res.status(401).json({ error: error.message })
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                //SEND mail
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Your account has not been confirmed. A confirmation email has been sent')
                return res.status(403).json({ error: error.message })
            }

            // chech for password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Incorrect username or password')
                return res.status(401).json({ error: error.message })
            }

            const token = generateJWT({id: user._id})
            
            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //invalid duplicates 
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('The user had not been registerted')
                return res.status(404).json({ error: error.message })
            }
            
            if (user.confirmed) {
                const error = new Error('The user had been confirmed')
                return res.status(403).json({ error: error.message })
            }

            //Create Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id;

            //SEND mail
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('A new Token had been sended')
        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //invalid duplicates 
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('The user had not been registerted')
                return res.status(404).json({ error: error.message })
            }

            //Create Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id;
            await token.save()

            //SEND mail
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Check your email')
        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(401).json({ error: error.message })
            }
            
            res.send('Correct token, type a new password')

        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Invalid Token')
                return res.status(401).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            
            res.send('Password had been succesfuly updated')

        } catch (error) {
            res.status(500).json({ erro: 'Internal server error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user);
    }

    static updateProfile = async (req: Request, res: Response) => {
        const {name, email} = req.body

        const userExists = await User.findOne({email})
        if(userExists && userExists._id.toString() !== req.user._id.toString()) {
            const error = new Error('Email already exists')
            return res.status(409).json({error: error.message})
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Profile updated successfully')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password} = req.body

        const user = await User.findById(req.user._id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Wrong password')
            return res.status(401).json({error: error.message})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).send('Internal server error')
        }

    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user._id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Wrong password')
            return res.status(401).json({error: error.message})
        }

        res.send('Correct password')
    }

}