import { Router } from "express";
import upload from "./multerConfig.js";

import {
	getAllInterest,
	getOneInterest,
	createInterest,
	deleteInterest,
} from "./controllers/interest.js";

import {
	getAllCorporateExperience,
	getOneCorporateExperience,
	createCorporateExperience,
	deleteCorporateExperience,
} from "./controllers/corporate_experience.js";

import {
	getAllStartupExperience,
	getOneStartupExperience,
	createStartupExperience,
	deleteStartupExperience,
} from "./controllers/startup_experience.js";

import {
	createExpertise,
	getOneExpertise,
	getAllExpertise,
	deleteOneExpertise,
} from "./controllers/expertise.js";

import {
	createEducation,
	getOneEducation,
	getAllEducation,
	deleteOneEducation,
} from "./controllers/education.js";

import {
	createUser,
	verifyUser,
	deleteUser,
	getAllUser,
	getOneUser,
	getCurrentUser,
	isCurrentUser,
	updateUser,
	signIn,
	followUser,
	isFollowingUser,
	unfollowUser,
	getFollowers,
	getFollowing,
} from "./controllers/user.js";

import {
	createCertificationsCourses,
	getAllCertificationsCourses,
	getOneCertificationsCourses,
	deleteCertificationsCourses,
} from "./controllers/certifications_courses.js";
import {
	createLanguage,
	getAllLanguage,
	getOneLanguage,
	deleteLanguage,
} from "./controllers/languages.js";
import {
	createSocialMedia,
	getAllSocialMedia,
	getOneSocialMedia,
	deleteSocialMedia,
} from "./controllers/social_media.js";
import {
	createCompany,
	getAllCompanies,
	getCompany,
	deleteCompany,
	isCurrentCompany,
	getOneCompanyProfile,
	getCurrentCompanyProfile,
} from "./controllers/company_profile.js";

import {
	createKeyEmployee,
	getAllKeyEmployee,
	getOneKeyEmployee,
	deleteKeyEmployee,
} from "./controllers/key_employees.js";

import {
	createFounder,
	getAllFounder,
	getOneFounder,
	deleteFounder,
} from "./controllers/founder.js";

import {
	createFinancial,
	getAllFinancial,
	getOneFinancial,
	deleteOneFinancial,
} from "./controllers/financial.js";
import {
	createFundingRound,
	deleteOneFundingRound,
	getAllFundingRound,
	getOneFundingRound,
} from "./controllers/funding_round.js";
import {
	createProductInformation,
	deleteOneProductInformation,
	getAllProductInformation,
	getOneProductInformation,
} from "./controllers/product_information.js";
import {
	createActivity,
	deleteOneActivity,
	getAllActivity,
	getOneActivity,
} from "./controllers/activity.js";

import {
	uploadUserFile,
	getAllUserFile,
	getUserFile,
	deleteUserFile,
} from "./controllers/user_file.js";

import { verifiedUser } from "./middlewares/verified_mail.js";

const router = Router();

router.post("/createInterest", createInterest);
router.get("/getAllInterest", getAllInterest);
router.get("/getOneInterest", getOneInterest);
router.delete("/deleteInterest", deleteInterest);

router.post("/createCorporateExperience", createCorporateExperience);
router.get("/getAllCorporateExperience", getAllCorporateExperience);
router.get("/getOneCorporateExperience", getOneCorporateExperience);
router.delete("/deleteCorporateExperience", deleteCorporateExperience);

router.post("/createStartupExperience", createStartupExperience);
router.get("/getAllStartupExperience", getAllStartupExperience);
router.get("/getOneStartupExperience", getOneStartupExperience);
router.delete("/deleteStartupExperience", deleteStartupExperience);

router.post("/createExpertise", createExpertise);
router.get("/getOneExpertise", getOneExpertise);
router.get("/getAllExpertise", getAllExpertise);
router.delete("/deleteOneExpertise", deleteOneExpertise);

//education
router.post("/createEducation", createEducation);
router.get("/getOneEducation", getOneEducation);
router.get("/getAllEducation", getAllEducation);
router.delete("/deleteOneEducation", deleteOneEducation);

//user
router.get("/getAllUsers", getAllUser);
router.get("/getOneUser", getOneUser);
router.get("/isCurrentUser", isCurrentUser);
router.get("/getCurrentUser", getCurrentUser);
router.delete("/deleteUser", deleteUser);
router.put("/updateUser", updateUser);
router.put("/followUser", followUser);
router.get("/isFollowing", isFollowingUser);
router.put("/unfollowUser", unfollowUser);
router.get("/getFollowers", getFollowers);
router.get("/getFollowing", getFollowing);
//Certifications_Courses
router.post("/createCertificationsCourses", createCertificationsCourses);
router.get("/getAllCertificationsCourses", getAllCertificationsCourses);
router.get("/getOneCertificationsCourses", getOneCertificationsCourses);
router.delete("/deleteCertificationsCourses", deleteCertificationsCourses);

//Languages
router.post("/createLanguage", createLanguage);
router.get("/getAllLanguage", getAllLanguage);
router.get("/getOneLanguage", getOneLanguage);
router.delete("/deleteLanguage", deleteLanguage);

//Social Media
router.post("/createSocialMedia", createSocialMedia);
router.get("/getAllSocialMedia", getAllSocialMedia);
router.get("/getOneSocialMedia", getOneSocialMedia);
router.delete("/deleteSocialMedia", deleteSocialMedia);

//company
router.post("/createCompany", createCompany);
router.get("/getAllCompany", getAllCompanies);
router.get("/getOneCompany", getCompany);
router.delete("/deleteCompany", deleteCompany);
router.get("/isCurrentCompany", isCurrentCompany);
router.get("/getOneCompanyProfile", getOneCompanyProfile);
router.get("/getCurrentCompanyProfile", getCurrentCompanyProfile);

//key employee
router.post("/createKeyEmployee", createKeyEmployee);
router.get("/getAllKeyEmployee", getAllKeyEmployee);
router.get("/getOneKeyEmployee", getOneKeyEmployee);
router.delete("/deleteKeyEmployee", deleteKeyEmployee);

//Founder
router.post("/createFounder", createFounder);
router.get("/getAllFounder", getAllFounder);
router.get("/getOneFounder", getOneFounder);
router.delete("/deleteFounder", deleteFounder);

//financial
router.post("/createFinancial", createFinancial);
router.get("/getAllFinancial", getAllFinancial);
router.get("/getOneFinancial", getOneFinancial);
router.delete("/deleteFinancial", deleteOneFinancial);

//funding_round
router.post("/createFundingRound", createFundingRound);
router.get("/getAllFundingRound", getAllFundingRound);
router.get("/getOneFundingRound", getOneFundingRound);
router.delete("/deleteFundingRound", deleteOneFundingRound);

//product_information
router.post("/createProductInformation", createProductInformation);
router.get("/getAllProductInformation", getAllProductInformation);
router.get("/getOneProductInformation", getOneProductInformation);
router.delete("/deleteProductInformation", deleteOneProductInformation);

//activity
router.post("/createActivity", createActivity);
router.get("/getAllActivity", getAllActivity);
router.get("/getOneActivity", getOneActivity);
router.delete("/deleteActivity", deleteOneActivity);

router.post("/uploadUserFile", upload.single("file"), uploadUserFile);
router.get("/getUserFile", getUserFile);
router.get("/getAllUserFile", getAllUserFile);
router.delete("/deleteUserFile", deleteUserFile);

export default router;
