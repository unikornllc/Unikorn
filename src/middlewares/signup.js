export const confirmPassword = async (req, res, next) => {
	try {
		if (!req.body.formData.password || !req.body.formData.confirmPassword) {
			res.status(400).json({ message: "Enter Password lil bro." });
		} else if (
			req.body.formData.password.length < 5 ||
			!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.formData.password)
		) {
			res.status(400).json({
				message:
					"Password must be at least 5 characters long and contain at least one special character.",
			});
		} else if (
			req.body.formData.password == req.body.formData.confirmPassword
		) {
			res.status(200);
			next();
		} else {
			res.status(400).json({ message: "Passwords does not match." });
		}
	} catch (e) {
		res.status(400).json({ message: "Error in confirmPassword" });
	}
};
