import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateTokenAndResponse = async (user, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '1d',
	});

	user.password = undefined;

	res.status(201).json({
		user,
		token,
	});
};

export const signupController = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// email,password validation
		if (!name) {
			throw new Error('Name field is required');
		}

		const userexist = await User.findOne({ email });
		// console.log(userexist);
		if (userexist) {
			throw new Error('Email Already Exist!!!');
		}

		// Add to DB or some kind of email verification

		const user = await new User({
			name,
			email,
			password,
		}).save();

		// generate token and response

		generateTokenAndResponse(user, res);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check for email

		const user_details = await User.findOne({ email });
		if (!user_details) {
			throw new Error('Email Does not Exist');
		}

		// check for password
		const user = user_details;
		if (!(await user.comparePassword(password))) {
			throw new Error('Password Invalid');
		}

		//generate token and send response

		generateTokenAndResponse(user, res);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const profileController = async (req, res) => {
	res.status(200).json(req.user);
};
