import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

//ts
export interface IProject extends Document  {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]     // un proyecto puee tener multiples tareas por eso es array
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
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
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

//middleware for deleting tasks when a project is deleted
projectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    if(!projectId) return

    const tasks = await Task.find({project: projectId})
    for(const task of tasks) {
        await Note.deleteMany({task: task._id})  //delete all notes related to the task
    }

    await Task.deleteMany({project: projectId})
})

// con el generic<> le digo que caracteristicas quiero tener en mi codigo del proyecto
const Project = mongoose.model<IProject>('Project', projectSchema)
export default Project