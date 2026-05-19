import type {Request, Response, NextFunction} from 'express'
import Task, { ITask } from '../models/Task'

// reescritura del scop global del request para obtener los datos de la url
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExist(req:Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if(!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({error: error.message})
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction ) {
    if(!req.task.project.equals(req.project._id)) {
        const error = new Error('Accion no valida')
        return res.status(400).json({error: error.message})
    }
    next()
}