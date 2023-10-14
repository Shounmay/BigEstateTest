import express from 'express';
import {
	loginController,
	profileController,
	signupController,
	metaSDKreports,
} from '../controllers/authController.js';
import { requireSignIn, metaLogin } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/profile', requireSignIn, profileController);
router.post('/metageneratereports/:id', metaLogin, metaSDKreports);

export default router;
