import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // el buffer se hace en ram
  limits: { fileSize: 10 * 1024 * 1024 } // max 10 MB
});
