import { Router } from "express";
import { authController } from "../controller/userController"; 

export const router=Router()

router.post('/login',authController.login)
router.post('/signup',authController.signup)



