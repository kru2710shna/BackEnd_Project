import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.Model.js'
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import verifyJWT from '../middlewares/auth.middleware.js'


const generateAcessAndRefreshTokens = async (userId){
    try {

        const user = await User.findById(userId)
        const AcessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { AcessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something Went Wrong ")
    }
}

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

    const { username, email, fullname, password } = req.body

    if (
        [username, email, fullname, password].some((fields) =>
            fields?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    const exitedUser = await User.findOne({
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

//  Route -2 
const loginUser = asyncHandler(async (req, res) => {

    // Get data from the body- username, email
    // Find the user 
    // check password 
    // access and refresh token 
    // send secure cookies 
    // response 

    const { email, password, username } = req.body

    if (username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Credentials")
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json(
            new ApiError(200, {
                user: loggedInUser, accessToken: accessToken, refreshToken, refreshToken
            },
                "User Logged In Successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie(accessToken)
        .clearCookie(refreshToken)
        .json(new ApiError(200, {}, "User logged out successfully"))
})



export { registerUser, loginUser, logoutUser }