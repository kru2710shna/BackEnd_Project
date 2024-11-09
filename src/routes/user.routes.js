import {Router} from "express"
import {registerUser} from '../controllers/user.controller.js'
const router = Router()

// Route-1 
router.route("/register").post(registerUser)


export default router 