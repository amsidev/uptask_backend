import type { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Projects"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        //Find user
        const user = await User.findOne({email}).select('id email name')
        if(!user) {
            const error = new Error('User not found')
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }
    
    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project._id).populate('team', 'name email') //path, select
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const {id} = req.body;

        //Find user
        const user = await User.findById(id).select('id')
        if(!user) {
            const error = new Error('User not found')
            return res.status(404).json({error: error.message})
        }
        
        if(req.project.team.some(team => team.toString() === user._id.toString())) {
            const error = new Error('User is already assigned to this project')
            return res.status(409).json({error: error.message})
        }

        req.project.team.push(user._id)
        await req.project.save()

        res.send('User has been added successfuly')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const {id} = req.body;
        
        if(!req.project.team.some(team => team.toString() === id)) {
            const error = new Error('User is not assigned to this project')
            return res.status(404).json({error: error.message})
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id);
        await req.project.save()
        res.send('User has been removed successfuly')
    }

}