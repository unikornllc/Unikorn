import NodeMailer from "nodemailer";
import prisma from "../db.js";

const sendPasswordResetEmail = async (email, token) => {
	const resetLink = `${process.env.FRONTEND}/reset-password?token=${token}`;
	const transporter = NodeMailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	await transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: account.email,
		subject: "Password Reset",
		html: `Click <a href="${resetLink}">here</a> to reset your password.`,
	});
};

export const resetpassword = async (req, res) => {
	const { email } = req.body;

	const user = await prisma.user.findOne({ email });
	if (!user) {
		return res
			.status(200)
			.send(
				"If that email address is in our database, we will send you an email to reset your password.",
			);
	}
	const token = generateResetToken();
	user.resetPasswordToken = token;
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();
	await sendPasswordResetEmail(user.email, token);

	res
		.status(200)
		.send(
			"If that email address is in our database, we will send you an email to reset your password.",
		);
};

export const resetasync = async (req, res) => {
    const { token, password } = req.body;
  
    // 1. Find the user with the matching reset token and that the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }
  
    // 2. Update the password
    user.password = await hashPassword(password); // Ensure you hash the password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    // 3. Optionally, send a confirmation email
  
    res.status(200).send('Your password has been updated.');
  }