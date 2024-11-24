import multer from 'multer';
import path from 'path';

const publicFolder = path.resolve(__dirname, '..', '..', 'public');
export default {
    directory: publicFolder,

    storage: multer.diskStorage({
        destination: publicFolder,
        filename(req, file, cb) {
            const fileName =
                new Date().getTime() + path.extname(file.originalname);

            return cb(null, fileName);
        },
    }),
};
