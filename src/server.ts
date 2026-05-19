import expres, {Express} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

dotenv.config()
connectDB()

const app : Express = expres()
app.use(cors(corsConfig))

// Loggin
app.use(morgan('dev'))

// Leer datos del formulario
app.use(expres.json())

// Routes
app.use('/api/auth', authRoutes )
app.use('/api/projects', projectRoutes)

export default app