const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow images, pdfs, docs, text, audio, video
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
        "audio/webm",
        "video/mp4",
        "video/webm"
    ];

    if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB limit
    },
    fileFilter
});

module.exports = upload;
