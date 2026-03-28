import expres from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'

dotenv.config()

connectDB()

const app = expres()

export default app