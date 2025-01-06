import prisma from "../db.js";
import NodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import { comparePasswords } from "./auth.js";
import { hashPassword } from "./auth.js";
import { createJWT } from "./auth.js";

export const createUser = async (req, res) => {
  try {
    const userData = req.body.formData;
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        description: userData.description || "",
        title: userData.title,
      },
    });

    const email = userData.email;
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("userId", newUser.id, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    const transporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "unikorn2025@gmail.com",
        pass: "sihs kadv vsdb yeqn",
      },
    });

    const verificationLink = `${process.env.FRONTEND}/verifyUser`;
    await transporter.sendMail({
      from: "unikorn2025@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    res.status(200).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  const token = req.cookies["token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    await prisma.user.update({
      where: {
        email: decoded.email,
      },
      data: {
        verified: true,
      },
    });
    res.status(200).send("Account successfully verified! You can now log in.");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user or company
    const user =
      (await prisma.user.findUnique({
        where: {
          email: email,
        },
      })) ||
      (await prisma.user.findUnique({
        where: {
          username: email,
        },
      }));

    const company = !user
      ? (await prisma.company_Profile.findUnique({
          where: {
            username: email,
          },
        })) ||
        (await prisma.company_Profile.findUnique({
          where: {
            email: email,
          },
        }))
      : null;

    // If neither user nor company is found
    if (!user && !company) {
      return res
        .status(400)
        .json({ message: "Error signing in: Invalid credentials." });
    }

    // Validate password
    const account = user || company;
    const isValid = await comparePasswords(password, account.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Create JWT token
    const token = createJWT({
      id: account.id,
      role: user ? "user" : "company",
    });

    // Set cookies
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("userId", account.id, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Successful login response
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "An error occurred while signing in." });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching users" });
  }
};
export const getOneUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.query.username,
      },
    });
    const { verified, password, email, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching user" });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.cookies.userId,
      },
    });
    const { verified, id, password, email, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching user" });
  }
};
export const isCurrentUser = async (req, res) => {
  try {
    let isCurrentUser = false;
    const user = await prisma.user.findUnique({
      where: {
        username: req.query.username,
      },
    });
    if (req.cookies.userId && user.id && req.cookies.userId == user.id) {
      isCurrentUser = true;
    }
    res.status(200).json({ user, isCurrentUser });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching user" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const id = req.body.userId;
    await prisma.social_Media.deleteMany({ where: { userId: id } });
    await prisma.interest.deleteMany({ where: { userId: id } });
    await prisma.corporate_Experience.deleteMany({ where: { userId: id } });
    await prisma.expertise.deleteMany({ where: { userId: id } });
    await prisma.education.deleteMany({ where: { userId: id } });
    await prisma.language.deleteMany({ where: { userId: id } });
    await prisma.startup_Experience.deleteMany({ where: { userId: id } });
    await prisma.certifications_Courses.deleteMany({ where: { userId: id } });
    const user = await prisma.user.delete({ where: { id: id } });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error deleting user" });
  }
};

// export const suggestUsername = async (req, res) => {
// 	try {
// 		const baseusername = req.query.email.split("@")[0].toLowerCase();
// 		const basename = req.query.name.split(" ");
// 		const basenameI = basename[0].toLowerCase();
// 		const basenameF = basename[basename.length - 1].toLowerCase();
// 		let username1 = baseusername + (Math.floor(Math.random() * 900) + 100);
// 		let username2 =
// 			basenameI + basenameF + (Math.floor(Math.random() * 900) + 100);
// 		let username3 =
// 			basenameF + "_" + basenameI + (Math.floor(Math.random() * 900) + 100);
// 		let count;
// 		while (await prisma.user.findUnique({ where: { username: username1 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username1 = baseusername + count;
// 		}
// 		while (await prisma.user.findUnique({ where: { username: username2 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username2 = basenameI + basenameF + count;
// 		}
// 		while (await prisma.user.findUnique({ where: { username: username3 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username3 = basenameF + "_" + basenameI + count;
// 		}
// 		res.status(200).json({ username: [username1, username2, username3] });
// 	} catch (e) {
// 		console.error(e);
// 	}
// };

export const suggestUsername = async (req, res) => {
  try {
    const { email, name } = req.query;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required." });
    }
    const usernameSuggestions = suggestUsernamePassport(email, name);

    res.status(200).json({ username: usernameSuggestions });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

export async function suggestUsernamePassport(email, name) {
  const MIN_USERNAME_LENGTH = 5;
  const MAX_USERNAME_LENGTH = 16;

  const ensureMinLength = (username) => {
    if (username.length >= MIN_USERNAME_LENGTH) {
      return username;
    }
    let extendedUsername = username;
    const potentialAdditions = [firstName, lastName, emailNamePart, initials]
      .filter((part) => part && !extendedUsername.includes(part))
      .map((part) =>
        part.substring(0, MIN_USERNAME_LENGTH - extendedUsername.length)
      );

    for (const part of potentialAdditions) {
      extendedUsername += part;
      if (extendedUsername.length >= MIN_USERNAME_LENGTH) {
        break;
      }
    }

    if (extendedUsername.length < MIN_USERNAME_LENGTH) {
      const numbersNeeded = MIN_USERNAME_LENGTH - extendedUsername.length;
      const randomNumber = Math.floor(
        Math.random() * Math.pow(10, numbersNeeded)
      );
      extendedUsername += randomNumber.toString().padStart(numbersNeeded, "0");
    }
    return extendedUsername.substring(0, MAX_USERNAME_LENGTH);
  };

  const emailNamePart = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const names = name.trim().split(" ").filter(Boolean);
  const firstName = names[0]
    ? names[0].toLowerCase().replace(/[^a-z]/g, "")
    : "";
  const lastName =
    names.length > 1
      ? names[names.length - 1].toLowerCase().replace(/[^a-z]/g, "")
      : "";
  const initials = (firstName.charAt(0) || "") + (lastName.charAt(0) || "");

  const trimmedEmailPart = emailNamePart.substring(0, MAX_USERNAME_LENGTH);
  const trimmedFirstName = firstName.substring(0, MAX_USERNAME_LENGTH);
  const trimmedLastName = lastName.substring(0, MAX_USERNAME_LENGTH);

  const baseUsernames = [
    `${trimmedFirstName}.${trimmedLastName}`,
    `${trimmedFirstName}${trimmedLastName}`,
    `${initials}${trimmedLastName}`,
    `${trimmedLastName}${initials}`,
    `${trimmedEmailPart}`,
  ].map((username) => ensureMinLength(username));

  const generateUniqueUsername = async (base) => {
    let username = base.substring(0, MAX_USERNAME_LENGTH);
    let suffix = 0;
    username = username.replace(/\.$/, "");

    let isUnique = false;
    do {
      let potentialUsername = username;
      if (suffix > 0) {
        potentialUsername = `${username}${suffix}`;
        potentialUsername = potentialUsername.substring(0, MAX_USERNAME_LENGTH);
      }
      potentialUsername = ensureMinLength(potentialUsername);

      const userExists = await prisma.user.findUnique({
        where: { username: potentialUsername },
      });

      if (!userExists) {
        isUnique = true;
        username = potentialUsername;
      } else {
        suffix++;
      }
    } while (!isUnique && suffix < 1000);

    return username;
  };

  const usernameSuggestions = [];

  for (const base of baseUsernames) {
    const username = await generateUniqueUsername(base);
    if (
      usernameSuggestions.length < 3 &&
      !usernameSuggestions.includes(username)
    ) {
      usernameSuggestions.push(username);
    }
    if (usernameSuggestions.length >= 3) {
      break;
    }
  }
  while (usernameSuggestions.length < 3) {
    const randomUsername = generateUsername("", 2, 0);
    console.log(randomUsername);
    let trimmedRandomUsername = randomUsername
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, MAX_USERNAME_LENGTH);
    trimmedRandomUsername = ensureMinLength(trimmedRandomUsername);

    const userExists = await prisma.user.findUnique({
      where: { username: trimmedRandomUsername },
    });

    if (!userExists && !usernameSuggestions.includes(trimmedRandomUsername)) {
      usernameSuggestions.push(trimmedRandomUsername);
    }
  }
  return usernameSuggestions;
}

export const followUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.cookies.userId },
      select: { following: true },
    });

    const isAlreadyFollowing = user.following.includes(req.body.followerId);
    if (isAlreadyFollowing) {
      res.status(400).json({ message: "User already followed" });
    } else {
      await prisma.user.update({
        where: { id: req.cookies.userId },
        data: {
          following: {
            set: [...user.following, req.body.followerId],
          },
        },
      });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error following user" });
  }
};

export const isFollowingUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.cookies.userId },
      select: { following: true },
    });
    const followingId = await prisma.user.findUnique({
      where: { username: req.query.username },
      select: { id: true },
    });
    const isFollowing = user.following.includes(followingId.id);
    console.log(isFollowing);
    res.status(200).json({ isFollowing });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching user" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.cookies.userId },
      select: { following: true },
    });

    const isAlreadyFollowing = user.following.includes(req.body.followerId);
    if (!isAlreadyFollowing) {
      res.status(400).json({ message: "User not followed" });
    } else {
      await prisma.user.update({
        where: { id: req.cookies.userId },
        data: {
          following: {
            set: user.following.filter((id) => id != req.body.followerId),
          },
        },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error unfollowing user" });
  }
};
