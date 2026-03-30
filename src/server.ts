import expres from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'

dotenv.config()

connectDB()

const app = expres()

app.use(expres.json())

// Routes
app.use('/api/projects', projectRoutes)
// app.use('/api/projects', )

export default app