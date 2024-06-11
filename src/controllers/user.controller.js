import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCLoundinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // Demo
    // res.status(200).json({
    //     message : "Aman Kumar Jha"
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

    const {fullName, username, email, password} = req.body
    console.log("email : ", email);

    // if (fullName === "") {
    //     throw new ApiError(400,"fullname is required");
    // }

    if ([fullName, email, password, username].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required")
    }

    // check that the user exist of not
    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })
    
    if (existedUser) {
        throw new ApiError(409, 'User with email or userName exist')
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required")
    
    // uploading to cloudinary
    const avatar = await uploadOnCLoundinary(avatarLocalPath)
    const coverImage = await uploadOnCLoundinary(coverImageLocalPath)


    if (!avatar) throw new ApiError(400, "Avatar file required")
    
    
    // Stroring in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.tolowerCase()
    })

    // check that the user is created in DB or not
    const createduser = await User.findById(user._id).select(      // removing the specific field refreshToken and password 
      "-password -refreshToken"
    );

    if(!createduser) throw new ApiError(500, "Something went wrong while registring the user")
    
    // APi Response
    return res.status(201).json(
        new ApiResponse(200, createduser, "User Registered Successfully")
    )
})



export {registerUser}