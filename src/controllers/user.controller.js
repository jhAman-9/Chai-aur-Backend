import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCLoundinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // saving refresh token to the DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access toke"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Demo
  //     res.status(200).json({
  //         message: "Aman Kumar Jha"
  //     })
  // })

  // get user details from frontend
  // validation - not empty
  // check if user already exists : username, email
  // check for image, check for avatar
  // check them to cloudinary, avatar
  // create user object -  create entry in db
  // remove password and refresh token field from response
  // chech for user creation
  // return response

  const { fullName, username, email, password } = req.body;
  console.log("email : ", email);

  console.log(req.files);

  // if (fullName === "") {
  //     throw new ApiError(400,"fullname is required");
  // }

  if (
    [fullName, email, password, username].some(
      (field) => field?.trim() === "" // if empty any field throw error
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check that the user exist of not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.file?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  let coverImageLocalPath;
  // putting checks for cover Image and now wothout coverImage put req should be taken
  if (
    req.file &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // uploading to cloudinary
  const avatar = await uploadOnCLoundinary(avatarLocalPath);
  const coverImage = await uploadOnCLoundinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file required");

  // Storing in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // check that the user is created in DB or not
  const createduser = await User.findById(user._id).select(
    // removing the specific field refreshToken and password
    "-password -refreshToken"
  );

  if (!createduser)
    throw new ApiError(500, "Something went wrong while registring the user");

  // APi Response
  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data le aao
  // username or email
  // find the user
  // password check  (user mila to) also check wrong pass or not
  // access token and refresh token
  // send cookie
  // then send res that successfully login

  const { email, username, password } = req.body;

  if (!username && !email)
    throw new ApiError(400, "username or email is required");

  // find the username or email from User Model
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(404, "User does not exist");

  // User then password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // option designed for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

// when logout do refreshToken Undefined
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

// user match with refersh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) throw new ApiError(401, "Unauthorized Request");
  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(402, "Invalid refresh Token");

    // matching the DB stored refresh token and incommming refresh token
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "REfresh token is expired or used");
    }

    // if both refreshToken are equal then generate a new refresh Token
    const options = {
      httpOnly: true,
      secure: true,
    };

    // generating new access Token and Refresh Token
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

// Change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Invalid Old Password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// Get current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "Current User Fetched Successfully");
});

// Text based Data Update
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) throw new ApiError(400, "All Field Required");

  

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email:email
      }
    },
    {new: true}
  ).select("-password")     // removing password

  return res
  .status(new ApiResponse(200, user, "Account Details Updated Successfully"))

});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) throw new ApiError(400, "Cover Image File is misssing");
  
  const coverImage = await uploadOnCLoundinary(coverImageLocalPath);

  if (!coverImage.url)
    throw new ApiError(400, "Error While uploading on Cover Image");
  
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  
  return res
    .status(200)
    .json(
    new ApiResponse(200, user, "Cover Image Updated Successfuly")
  )
  
})
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) throw new ApiError(400, "Avatar File is misssing")
  
  const avatar = await uploadOnCLoundinary(avatarLocalPath);

  if (!avatar.url) throw new ApiError(400, "Error While uploading on avatar")
  
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
          avatar : avatar.url
        }
    },
    {
      new : true
    }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated Successfuly"));
  
  
  
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};