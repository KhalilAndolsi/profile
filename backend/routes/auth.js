const router = require("express").Router();
const {
  registerCtrl,
  loginCtrl,
  updateCtrl,
  deleteCtrl
} = require("../controllers/authCtrls");
const { validateObjectId } = require("../middlewares/verifyId");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", registerCtrl);
router.post("/login", loginCtrl);
router
  .route("/update/:id")
  .put(validateObjectId, verifyToken, updateCtrl)
  .delete(validateObjectId, verifyToken, deleteCtrl);

module.exports = router;
