import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campus-flow/user-documents",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  } as any,
});

const upload = multer({ storage });

export default upload;
