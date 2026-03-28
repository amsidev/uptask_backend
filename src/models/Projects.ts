import mongoose, { Schema, Document } from "mongoose";

//ts
export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string
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
})

// con el generic<> le digo que caracteristicas quiero tener en mi codigo del proyecto
const Project = mongoose.model<ProjectType>('Project', projectSchema)
export default Project