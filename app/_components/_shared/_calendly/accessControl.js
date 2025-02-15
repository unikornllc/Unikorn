export function canViewCalendly(currentUser, profileUser) {
	if (profileUser.calendlyVisibility === "PUBLIC") {
		return true;
	}

	if (!currentUser) {
		return false;
	}

	switch (profileUser.calendlyVisibility) {
		case "PRO_USERS":
			return currentUser.subscription === "PRO";
		case "INVESTORS":
			return currentUser.role === "INVESTOR";
		case "ENTREPRENEURS":
			return currentUser.role === "ENTREPRENEUR";
		case "CUSTOM":
			return customFilterCheck(currentUser, profileUser);
		default:
			return false;
	}
}

function customFilterCheck(currentUser, profileUser) {
	if (
		profileUser.allowedIndustries.length &&
		!profileUser.allowedIndustries.includes(currentUser.industry)
	) {
		return false;
	}

	if (
		profileUser.minYearsOfOperation &&
		currentUser.yearsOfOperation < profileUser.minYearsOfOperation
	) {
		return false;
	}

	if (
		profileUser.allowedRoles.length &&
		!profileUser.allowedRoles.includes(currentUser.role)
	) {
		return false;
	}

	return true;
}
