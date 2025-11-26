import cloudianry from "../config/cloudinary.js";
import streamifier from 'streamifier';

export const uploadToCloudinary = async (fileBuffer, folder) => {

    return new Promise((resolve, reject) => {
        let stream = cloudianry.uploader.upload_stream(
            {folder}, 
            (err, result) => {
                if (result) resolve(result);
                else reject(err)

            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}