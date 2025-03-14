// const Rental = require("../models/rental.model");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
// signup
const userSignup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Bad Request: Image file is required.");
    }

    let success = false;
    let user;
    const {
      firstName,
      lastName,
      address,
      contact,
      email,
      password,
      role,
      avatar,
    } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (existingUser) {
      // Update existing user with the new role
      if (role === "customer") {
        existingUser.isCustomer = true;
      } else if (role === "rental") {
        existingUser.isRental = true;
      } else {
        return res.status(400).json({
          success: false,
          message:
            "Invalid role provided. Please specify 'Customer' or 'Rental'.",
        });
      }
      // Save the updated user
      user = await existingUser.save();
    } else {
      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        address,
        contact,
        email,
        password: hashedPassword,
        isCustomer: role.toLowerCase() === "customer",
        isRental: role.toLowerCase() === "rental",
      });
      req.file.path = path.join("uploads", req.file.filename);

      console.log(req.body, req.file);
      const imageUrl = `${process.env.BACKEND_URL}/${req.file.path}`;

      newUser.avatar = imageUrl;

      // Save the new user
      user = await newUser.save();
    }

    success = true;
    const data = {
      user: {
        id: user.id,
        role: role,
      },
    };

    res.status(201).json({
      success: success,
      message: `${role} created/updated successfully`,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create/update user",
      error: error.message,
    });
  }
};

// login

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return res.status(404).json({ message: "User not found!" });

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Wrong credentials!" });

    req.user = validUser;

    // Generate JWT token
    const token = generateToken(validUser._id);

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    let profileType;
    if (validUser.userType === "customer") {
      profileType = "customer";
    } else if (validUser.userType === "rental") {
      profileType = "rental";
    }

    res.status(200).json({
      profileType,
      ...rest,
      token: token, // Add token to response data
    });
  } catch (error) {
    console.error("Error during user sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//  edit profile

const editProfile = async (req, res) => {
  try {
    // Check if the user ID from token matches the ID in the request params
    if (!req.params.id) {
      return res
        .status(401)
        .json({ message: "You can only update your own account!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({ rest });
  } catch (error) {
    console.error("Error during profile update:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res
      .status(500)
      .json({
        message:
          "An error occurred while updating the profile. Please try again later.",
      });
  }
};

// get profile

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "An error occurred while getting profile data. Please try again later.",
      });
  }
};

// forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({ message: "user not found" });
  }
  const resetToken = generateToken(user?._id);

  //resetpasswordUrl
  const resetPasswordUrl = `${process.env.REACT_APP_BASE_URL}/password/reset/${resetToken}`;
  console.log(resetPasswordUrl, "pass url");
  //message for customers
  const message = `Here is your password Reset Token :- \n\n ${resetPasswordUrl} 
  \n\n\n if you have not requested this email, please ignore it.`;
  //
  console.log("before try catch")
  try {
    //send Email function with an object object
    await sendEmail({
      email: user.email,
      subject: "Rent a Ride Password Recovery.",
      message,
    });
    console.log("user's mail")

    res.status(200).json({
    success: true,
      message: "Email sent Successfully.",
    });
  } catch (err) {
    //its an server error;
    res
      .status(500)
      .json({
        message: "An error occurred while sending email for forget password.",
      });
  }
};

// resetPassword when clicks on forgot link
const resetPassword = async (req, res) => {

  // we will find that user with this token and if the time is greater than now.
  const user = await User.findById(req.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("token is invlid ");
  }

  if (req.body.password != req.body.confirmPassword) {
    res.status(400);
    throw new Error("password don't match");
  }

  const hashedPassword = await bcryptjs.hash(req.body.password, 10);
  user.password = hashedPassword;
  await user.save();
res.status(200).json({message: "password reset succesfully"})
};

module.exports = { userSignup, userLogin, editProfile, getProfile, forgetPassword , resetPassword };
