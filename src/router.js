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
} from "./controllers/corporateExperience.js";

import {
	getAllStartupExperience,
	getOneStartupExperience,
	createStartupExperience,
	deleteStartupExperience,
} from "./controllers/startupExperience.js";

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
	getAllUser,
	getOneUser,
	getCurrentUser,
	isCurrentUser,
	updateUser,
	getTier,
	updateTier,
	updateUserItem,
	searchUsers,
} from "./controllers/user.js";

import {
	followUser,
	isFollowingUser,
	unfollowUser,
	getFollowers,
	getFollowing,
	followCompany,
	unfollowCompany,
	isFollowingCompany,
	getFollowingCompanies,
	getMyFollowing,
	getMyFollowers,
} from "./controllers/follow.js";

import {
	createCertificationsCourses,
	getAllCertificationsCourses,
	getOneCertificationsCourses,
	deleteCertificationsCourses,
} from "./controllers/certificationsCourses.js";
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
} from "./controllers/socialMedia.js";
import {
	getAllCompanies,
	deleteCompany,
	isCurrentCompany,
	getOneCompanyProfile,
	updateCompanyProfile,
	getCurrentCompany,
} from "./controllers/companyProfile.js";

import {
	createKeyEmployee,
	getAllKeyEmployee,
	getOneKeyEmployee,
	deleteKeyEmployee,
} from "./controllers/keyEmployees.js";

import {
	createFounder,
	getAllFounder,
	getOneFounder,
	deleteFounder,
} from "./controllers/founder.js";

import { createFinancial, getAllFinancial } from "./controllers/financial.js";
import {
	createFundingRound,
	deleteOneFundingRound,
	getAllFundingRound,
	getOneFundingRound,
} from "./controllers/fundingRound.js";
import {
	createProductInformation,
	deleteOneProductInformation,
	getAllProductInformation,
	getOneProductInformation,
} from "./controllers/productInformation.js";
import {
	createActivity,
	deleteOneActivity,
	getAllActivity,
	getOneActivity,
} from "./controllers/activity.js";

import {
	authorizeCalendly,
	eventTypeCalendly,
	createEventTypeCalendly,
	getSchedulingLinkCalendly,
	callbackCalendly,
	disconnectCalendly,
	updateCalendlySettings,
} from "./controllers/calendly.js";

import {
	getCompanyActiveRaisingFund,
	getActiveRaisingFunds,
	investAtFixedPrice,
	makeInvestmentOffer,
	getMyInvestments,
	getMyInvestmentOffers,
	getFundingInvestmentOffers,
	acceptInvestmentOffer,
	rejectInvestmentOffer,
	cancelInvestmentOffer,
	cancelRaisingFunds,
	cancelInvestment,
	getCompanyPendingRaisingFund,
	getCompanyPastRaisingFunds,
	getRaisingFundFundraisers,
	getAllRaisingFunds,
	getRaisingFundById,
	getRaisingFundsStats,
	getActiveRaisingFundsFiltered,
} from "./controllers/raisingFunds.js";
import {
	depositWallet,
	getWallet,
	withdrawWallet,
} from "./controllers/wallet.js";
import { logout } from "./authentication/logout.js";

import {
	getAllWallets,
	getAllEntries,
	getAllJournals,
	getAllTransactions,
	getEntryById,
	getJournalById,
	getTransactionById,
	getWalletById,
	getAllLedgerAccounts,
	getLedgerAccountById,
} from "./controllers/ledger.js";

import {
	getAdminMetrics,
	getFundRaisingsFiltered,
	getJournalsFiltered,
	getTransactionsFiltered,
} from "./controllers/admin.js";

import {
	uploadFile,
	getAllFiles,
	getFile,
	deleteFile,
} from "./controllers/file.js";

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
router.get("/searchUsers", searchUsers);
router.get("/getAllUsers", getAllUser);
router.get("/getOneUser", getOneUser);
router.get("/isCurrentUser", isCurrentUser);
router.get("/getCurrentUser", getCurrentUser);
// router.delete("/deleteUser", deleteUser);
router.put("/updateUser", updateUser);
router.put("/updateUserItem", updateUserItem);
router.put("/followUser", followUser);
router.get("/isFollowing", isFollowingUser);
router.put("/unfollowUser", unfollowUser);
router.get("/getTier", getTier);
router.put("/updateTier", updateTier);

//wallet
router.put("/depositWallet", depositWallet);
router.put("/widthrawWallet", withdrawWallet);
router.get("/getWallet", getWallet);

//get followers and following returns an array of usernames
router.get("/getFollowers", getFollowers);
router.get("/getFollowing", getFollowing);
router.get("/getMyFollowing", getMyFollowing);
router.get("/getMyFollowers", getMyFollowers);

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
router.get("/getAllCompany", getAllCompanies);
router.delete("/deleteCompany", deleteCompany);
router.get("/isCurrentCompany", isCurrentCompany);
router.get("/getOneCompanyProfile", getOneCompanyProfile);
router.put("/updateCompanyProfile", updateCompanyProfile);
router.get("/isFollowingCompany", isFollowingCompany);
router.put("/followCompany", followCompany);
router.put("/unfollowCompany", unfollowCompany);
router.get("/getCurrentCompany", getCurrentCompany);

//get all companies that the user is following
//returns an array of usernames
router.get("/getFollowingCompanies", getFollowingCompanies);

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

//funding_round
router.post("/createFundingRound", createFundingRound);
router.get("/getAllFundingRound", getAllFundingRound);
router.get("/getOneFundingRound", getOneFundingRound);
router.delete("/deleteFundingRound", deleteOneFundingRound);

//productInformation
router.post("/createProductInformation", createProductInformation);
router.get("/getAllProductInformation", getAllProductInformation);
router.get("/getOneProductInformation", getOneProductInformation);
router.delete("/deleteProductInformation", deleteOneProductInformation);

//activity
router.post("/createActivity", createActivity);
router.get("/getAllActivity", getAllActivity);
router.get("/getOneActivity", getOneActivity);
router.delete("/deleteActivity", deleteOneActivity);

//userFile
router.post("/uploadFile", upload.single("file"), uploadFile);
router.get("/getFile", getFile);
router.get("/getAllFiles", getAllFiles);
router.delete("/deleteFile", deleteFile);

//calendlyIntegration
router.get("/calendly/auth", authorizeCalendly);
router.get("/calendly/eventType", eventTypeCalendly);
router.post("/calendly/createEventType", createEventTypeCalendly);
router.get("/calendly/auth/callback", callbackCalendly);
router.delete("/calendly/disconnect", disconnectCalendly);
router.put("/calendly/settings", updateCalendlySettings);

//raisingFunds and investments offers

router.get("/raisingFunds/active", getActiveRaisingFundsFiltered);
router.get("/raisingFunds/id/", getRaisingFundById);
router.get("/raisingFunds/stats", getRaisingFundsStats);
router.get("/raisingFunds/company/active", getCompanyActiveRaisingFund);
router.get("/raisingFunds/company/pending", getCompanyPendingRaisingFund);
router.get("/raisingFunds/company/past", getCompanyPastRaisingFunds);
router.get("/raisingFunds/fundraisers", getRaisingFundFundraisers);

router.get("/raisingFunds/offers", getFundingInvestmentOffers);
router.post("/raisingFunds/offer/accept", acceptInvestmentOffer);
router.post("/raisingFunds/offer/reject", rejectInvestmentOffer);
router.post("/raisingFunds/cancel", cancelRaisingFunds);

router.post("/investments/fixedPrice", investAtFixedPrice);
router.post("/investments/negotiatePrice", makeInvestmentOffer);
router.get("/investments/my", getMyInvestments);
router.post("/investments/cancel", cancelInvestment);
router.get("/investments/offers", getMyInvestmentOffers);
router.post("/investments/offer/cancel", cancelInvestmentOffer);

router.get("/getAllRaisingFunds", getAllRaisingFunds);
// router.get("/getRaisingFundsById", getRaisingFundById);

// Wallet and transactions

router.get("/getAllWallets", getAllWallets);
router.get("/getWalletById", getWalletById);

router.get("/getAllTransactions", getAllTransactions);
router.get("/getTransactionById", getTransactionById);

router.get("/getAllJournals", getAllJournals);
router.get("/getJournalById", getJournalById);

router.get("/getAllEntries", getAllEntries);
router.get("/getEntryById", getEntryById);

router.get("/getAllLedgerAccounts", getAllLedgerAccounts);
router.get("/getLedgerAccountById", getLedgerAccountById);

router.get("/admin/metrics", getAdminMetrics);
router.get("/admin/fundraisings", getFundRaisingsFiltered);
router.get("/admin/journals", getJournalsFiltered);
router.get("/admin/transactions", getTransactionsFiltered);

router.post("/logout", logout);

import {
	updatePersonnel,
	deletePersonnel,
	getCompanyOverview,
	updateCompanyOverview,
	// getFinancialInfo,
	addCompanyActivity,
	getProductInfo,
} from "./controllers/company.js";

router.put("/updatePersonnel", updatePersonnel);
router.delete("/deletePersonnel", deletePersonnel);
router.get("/getCompanyOverview", getCompanyOverview);
router.put("/updateCompanyOverview", updateCompanyOverview);
router.post("/addCompanyActivity", addCompanyActivity);
router.get("/getCompanyProductInfo", getProductInfo);

export default router;
