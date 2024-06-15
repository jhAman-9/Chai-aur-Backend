import multer from "multer";

// multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

    filename: function (req, file, cb) {
      
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cd(null, file.fieldname + "-" + uniqueSuffix);
      
      cb(null, file.originalname)
  },
});

export const upload = multer({ storage: storage });
