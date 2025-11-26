import { v2 as cloudianry } from 'cloudinary';
import { env } from './index.js'

cloudianry.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

export default cloudianry