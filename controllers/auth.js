const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // console.log(req.body);
  const user = await User.create({ ...req.body });
  // console.log(user);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Invalid email and password");
  }
  // console.log(password);
  const isPasswordCorrect = await user.camparePassword(password);
  // compare password
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid email and password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
