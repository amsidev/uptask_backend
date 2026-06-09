import { Router } from 'express'
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation';

const router : Router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({min: 8}).withMessage('Password is too short, minimum 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password do not match')
        }
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('A token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .notEmpty().withMessage('Invalid email'),   
    body('password')
        .notEmpty().withMessage('The Password is required'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .notEmpty().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

export default router