// just varify that the user exit or not

import jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

export const varifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) throw new ApiError(401, "Unauthorized request");
      
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
  
    if (!user) /*discuss*/ throw new ApiError(401, "Invalid Api Token")
    
    req.user = user;
    next();   // for next funtion to run
  }
  catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
  }
});
