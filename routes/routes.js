const { Router } = require("express");
const userC = require("../controller/user_controller");
const authC = require("../controller/auth_controller");
const verifyToken = require("../middleware/veriftoken");
let userRouter = Router();
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  // Mengecek tipe file yang diizinkan
  if (file.mimetype.match(/^image/)) {
    cb(null, true); // Mengizinkan file diunggah
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Menolak file yang tidak sesuai
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

userRouter.post("/users", upload.single("picture"), userC.createData);
userRouter.get("/users", userC.getData);
userRouter.get("/users/:id", userC.oneData);
userRouter.put("/users/update/:id", upload.single("picture"), userC.updateData);
userRouter.delete("/users/:id", userC.deleteData);

userRouter.post("/register", authC.register);
userRouter.post("/login", authC.login);
userRouter.get("/user", verifyToken, authC.getUser);
userRouter.get("/user/:id", authC.getUserById);

module.exports = userRouter;
