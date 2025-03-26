const router = require("express").Router();
const auth = require("../middleware/auth");
const {
	register,
	login,
	getUser,
	deleteUser,
	getAllUsers,
	rejectOrComfirmUser,
	forgotPassword,
	resetPassword,
	resendVerificationEmail
} = require("../controllers/UserController");

router.get("/", auth, getUser);
router.get("/alluser", getAllUsers);

router.post("/register", register);

router.post("/login", login);


router.delete("/delete/:id", auth, deleteUser);
router.post("/reject",rejectOrComfirmUser)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/resend-verification',resendVerificationEmail);
module.exports = router;
