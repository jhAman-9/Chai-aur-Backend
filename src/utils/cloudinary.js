import { v2 as cloudinary } from "cloudinary"
import fs from "fs"     // helps to link or unlink the file


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SERVICE
});



const uploadOnCLoundinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
         })
        // file has uploaded successfully
        // console.log('File is uploaded on cloudinary : ', response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}



// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );

export  {uploadOnCLoundinary}