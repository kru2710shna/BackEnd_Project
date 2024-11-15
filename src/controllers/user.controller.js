import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.Model.js'
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import verifyJWT from '../middlewares/auth.middleware.js'
import jwt from 'jsonwebtoken'
import { response } from 'express'

const generateAcessAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)
        const acessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        console.log("Generated Access Token:", acessToken);
        console.log("Generated Refresh Token:", refreshToken);

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { acessToken, refreshToken }

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

const loginUser = asyncHandler(async (req, res) => {

    // Get data from the body- username, email
    // Find the user 
    // check password 
    // access and refresh token 
    // send secure cookies 
    // response 

    const { email, password, username } = req.body

    if (username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // console.log("User Found:", user);

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Credentials")
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id)

    console.log("Access Token:", accessToken); // Debug log
    console.log("Refresh Token:", refreshToken); // Debug log

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
    }

    return res
        .status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json(
            new ApiError(200, {
                user,
                loggedInUser,
                accessToken,
                refreshToken
            },
                "User Logged In Successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized Request - No User Logged In");
    }

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
        secure: false,
    }

    return res
        .status(200)
        .clearCookie("access_token", options)
        .clearCookie("refresh_token", options)
        .json(new ApiError(200, {}, "User logged out successfully"))
})

const refreshAcessToken = asyncHandler(async (req, res) => {

    try {
        const incominfRefreshToken = req.cokkies.refreshToken || req.body.refreshToken

        if (!incominfRefreshToken) {
            throw new ApiError(401, "Unathorized refresh token")
        }

        const decodedToken = jwt.verify(incominfRefreshToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invlaid refresh Token")
        }
        if (incominfRefreshToken !== user?._id.refreshToken) {
            throw new ApiError(401, "Refresh Token is expried and used ")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { acessToken, newrefrehToken } = await generateAcessAndRefreshTokens(user._id)
        return response
            .status(200)
            .cookie("access_token", acessToken)
            .cookie("refresh_token", newrefrehToken)
            .json(new ApiResponse(200,
                { acessToken, newrefrehToken },
                "Acess Token refreshed"
            ))
    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid toekn refreshed")

    }

})

const ChnageCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    const user = User.findById(req.user?.id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        , json(new ApiError(200, {}, "Password Changed "))

})

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200)
        .json(200, req.user, "Current User Fetached Successfully")

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All Fields are Required")
    }

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }).select("-password")

    return res
        .status(200)
        .json(new ApiError(200, user, "Accoutn Detials Updated Successfully"))


})

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new ApiError(400, "No Avatar File")
    }

    const avatar = await uploadCloudinary(avatarlocalpath)

    if (avatar.url) {
        throw new ApiError(400, "Error while Uploading Avatar")
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return response.status(200)
        .json(new ApiError(200, user, "Successfully Upload the Avatar"))

})

const updateUserCoverImage = asyncHandler(async (req, res) => {

    const coverlocalpath = req.file?.path

    if (!coverlocalpath) {
        throw new ApiError(400, "No Avatar File")
    }

    const coverImage = await uploadCloudinary(avatarlocalpath)

    if (coverImage.url) {
        throw new ApiError(400, "Error while Uploading Avatar")
    }

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return response.status(200)
        .json(new ApiError(200, user, "Successfully Upload the CoverImage"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is Missingg")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"

            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "subscribedTo"

                },
                isSubscribed: {
                    $condition: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: flase

                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res.status(200)
        .json(new ApiResponse(200, channel[0], "User Channel Fetched Sucesfully "))

})

export { registerUser, loginUser, logoutUser, refreshAcessToken, ChnageCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile }