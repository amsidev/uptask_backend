import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router : Router = Router()

router.use(authenticate)

router.post('/', 
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Decripcion del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Decripcion del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/** Routes for tasks */
router.param('projectId',projectExist)

router.post('/:projectId/tasks', 
    hasAuthorization,
    body('name').notEmpty().withMessage('El Nombre del Tarea es Obligatoria'),
    body('description').notEmpty().withMessage('La Decripcion del Tarea es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('status').notEmpty().withMessage("The status is required"),
    handleInputErrors,
    TaskController.updateStatus

)

//Routes for teams
router.post('/:projectId/team/find', 
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid email'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

// Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('A note is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid Id'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router