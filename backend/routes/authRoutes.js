import express from 'express';
import {
	loginController,
	profileController,
	signupController,
} from '../controllers/authController.js';
import { requireSignIn } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/profile', requireSignIn, profileController);

export default router;
