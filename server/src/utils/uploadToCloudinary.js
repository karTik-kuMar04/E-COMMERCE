import cloudinary from "../config/cloudinary.js";
import streamifier from 'streamifier';

export const uploadToCloudinary = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
                if (err) return reject(err);
                return resolve(result); // includes secure_url & public_id
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};


export const deleteFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
}