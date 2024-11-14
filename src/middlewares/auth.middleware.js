import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from "jsonwebtoken"
import { User } from '../models/User.Model.js'


const verifyJWT = asyncHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Extracted Token:", token);

        if (!token) {
            throw new ApiError("401", "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded Token:", decodedToken);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken")

        if (!user) {
            // discuss about frontEnd
            throw new ApiError("401", "Invalid Acess Token")
        }
        req.user = user
        next()
        
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new ApiError(401, error?.mesaage || "Invalid Access Token")

    }

})  

export default verifyJWT;