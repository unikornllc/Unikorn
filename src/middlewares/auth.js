export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect(`${process.env.FRONTEND}/userhome`);
  }
};

export const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect(`${process.env.FRONTEND}/signin`);
  }
};
