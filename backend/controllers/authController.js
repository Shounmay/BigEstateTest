import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import adsSdk from 'facebook-nodejs-ads-sdk';
import Adreport from '../models/Adreports.js';

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

// const adsSdk = require('facebook-nodejs-business-sdk');
// const accessToken = 'EAAgVEf0lDZBsBO0IonYxM1WGkm52BV6hbZAVixjSWuQS0ZBc97CxcCQldBgn9aVN2yjBHjCUVoLZBrZBkUwo8xrZAvyZCbPOfo7xsLDORih9FoAklqwxkxtOkRaDFRdMoPofZA7cgxbSDZCr6z232rFwYjAUlKAfZBfJIdBr5uBpNwy0ZCMCfhh2anf5mHq';
// const api = adsSdk.FacebookAdsApi.init(accessToken);

export const metaSDKTest = async (req, res) => {
	try {
		const accessToken = '';
		const api = adsSdk.FacebookAdsApi.init(accessToken);
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount('');
		const Campaign = adsSdk.Campaign;

		let campaigns = await account.getCampaigns([Campaign.Fields.name], {
			limit: 20,
		});

		let campaign_user_set = [];

		let camp_arr = await campaigns.map((campaign) => ({
			name: campaign.name,
			id: campaign.id,
		}));
		campaign_user_set = [...camp_arr];
		// console.log(campaign_user_set);

		while (campaigns.hasNext()) {
			campaigns = await campaigns.next();
			let camp_arr = await campaigns.map((campaign) => ({
				name: campaign.name,
				id: campaign.id,
			}));
			campaign_user_set = [...campaign_user_set, ...camp_arr];
		}
		// console.log(campaign_user_set.length);
		const AdReport = await new Adreport({
			accountId: account.id,
			campaigns: campaign_user_set,
		}).save();
		console.log('Inserted: ', account.id);
	} catch (error) {
		console.log('error: ', error.message);
	}
};

export const metaSDKreports = async (req, res) => {
	try {
		const accessToken = req.token;
		const account_id = req.params.id;
		const api = adsSdk.FacebookAdsApi.init(accessToken);
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount(account_id);
		const Campaign = adsSdk.Campaign;

		// console.log(campaign_user_set.length);
		const Idexists = await Adreport.findOne({ accountId: account_id });
		if (!Idexists) {
			let campaigns = await account.getCampaigns([Campaign.Fields.name], {
				limit: 20,
			});

			let campaign_user_set = [];

			let camp_arr = await campaigns.map((campaign) => ({
				name: campaign.name,
				id: campaign.id,
			}));
			campaign_user_set = [...camp_arr];
			// console.log(campaign_user_set);

			while (campaigns.hasNext()) {
				campaigns = await campaigns.next();
				let camp_arr = await campaigns.map((campaign) => ({
					name: campaign.name,
					id: campaign.id,
				}));
				campaign_user_set = [...campaign_user_set, ...camp_arr];
			}
			const AdReport = await new Adreport({
				accountId: account.id,
				campaigns: campaign_user_set,
			}).save();
			console.log('Inserted: ', account.id);
			res.status(201).json({
				message: 'created',
				AdReport,
			});
		} else {
			console.log('Id already present');

			//  coding part for campaign retrival of selected date-range
			res.status(201).json({
				message: 'Id already exists',
			});
		}
	} catch (error) {
		console.log('error: ', error.message);
		res.status(401).json({
			Error: error.message,
		});
	}
};
