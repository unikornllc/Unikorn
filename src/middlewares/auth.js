export const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND}/userhome`);
	}
};

export const ensureGuest = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND}/signin`);
	}
};
