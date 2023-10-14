import { mongoose, model } from 'mongoose';

const AdSchema = new mongoose.Schema(
	{
		accountId: {
			type: String,
			required: true,
			unique: true,
		},
		campaigns: {
			type: [{}],
		},
	},
	{ timestamps: true }
);

export default model('Adreport', AdSchema);
