// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
//     api_key: process.env.CLOUDINARY_API_KEY as string,
//     api_secret: process.env.CLOUDINARY_API_SECRET as string,
// });

// const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
//     try {
//         if (!localFilePath) return null;

//         // Upload the file to Cloudinary
//         const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto",
//         });

//         // File uploaded successfully
//         fs.unlinkSync(localFilePath); // Remove the local file
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath); // Remove the local file on failure
//         return null;
//     }
// };

// export { uploadOnCloudinary };
