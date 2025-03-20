import { Request, RequestHandler } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { HttpStatus } from "../../../enums";
import { ApiError } from "../utils/ApiError";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const memoryStorage: StorageEngine = multer.memoryStorage();

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(HttpStatus.BAD_REQUEST, "Invalid file type. Only .png, .jpg, and .jpeg are allowed."));
    }
};

const upload = multer({
    storage: memoryStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadImage = (
    fieldName: string,
    options: { multiple?: boolean; maxCount?: number } = {}
): RequestHandler => {
    const { multiple = false, maxCount = 10 } = options;

    return multiple
        ? upload.array(fieldName, maxCount)
        : upload.single(fieldName);
};

export { uploadImage }