import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.Model.js'
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

    // Get User details from Front-End 

    // Validation 
    //    Check if user is already exists: username, email then don't allow
    //     Check for images, check for avatar
    //     Upload them to cloudinary, check avatar again

    // Try catch and Add User

    // Create User Object 
    // Db Entry
    // Remove password and refrest toek from the response 
    // Check for useer creation
    // return response 

    const { username, email, fullname, pasword } = req.body

    if (
        [username, email, fullname, pasword].some((fields) =>
            fields?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    const exitedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (exitedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar File is missing")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avtar File is missing")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        coverImage: coverImage?.url || "",
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registerin User")

    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Rgistered Successfully")
    )

})



export { registerUser }