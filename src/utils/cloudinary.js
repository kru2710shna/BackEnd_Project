import { v2 as cloudinary } from './cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const uploadCloudinary = async (localfilepath) => {
    try {

        if (!localfilepath) {
            return null
        }
        // upload file 
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })

        //file uplaoded 
        console.log("File uplaoded on cloudinary")
        console.log(response.url)
        return response

    } catch (error) {
        fs.unlink(localfilepath)
        return null

    }
}


export { uploadCloudinary }