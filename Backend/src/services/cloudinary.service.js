import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
function getCloudinary (){
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

return cloudinary 
}

// Upload image from buffer
export const uploadImage = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
          const cloud = getCloudinary();
        
        const uploadStream = cloud.uploader.upload_stream(
            {
                folder: options.folder || "general",
                public_id: options.fileName || undefined,
            },
            (error, result) => {
                if (error) {
        return reject(error);
    }

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

export default { uploadImage };