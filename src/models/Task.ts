import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIE: 'underReview',
    COMPLETED: 'completed'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof  taskStatus]

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
}

export const TaskSchema : Schema = new Schema ({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    project: {
        type: Types.ObjectId,   //almacenamos la referencia del proyecto
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),  // parseo de type a valor con la clase padre Object
        default: taskStatus.PENDING
    }
}, {timestamps: true})

//le pasamos el generic para que detecte el nombredel modelo y el schema
const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;