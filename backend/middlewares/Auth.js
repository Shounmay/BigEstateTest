import jwt from 'jsonwebtoken';
import User from '../models/user.js';
export const requireSignIn = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		// console.log(token);

		// verify it

		const userdetails = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: userdetails.id }).select(
			'-password'
		);

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ Error: error.message });
	}
};
