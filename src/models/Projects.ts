import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";

//ts
export interface IProject extends Document  {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]     // un proyecto puee tener multiples tareas por eso es array
}

//mongoose
const projectSchema: Schema = new Schema ({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    task: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {timestamps: true})

// con el generic<> le digo que caracteristicas quiero tener en mi codigo del proyecto
const Project = mongoose.model<IProject>('Project', projectSchema)
export default Project