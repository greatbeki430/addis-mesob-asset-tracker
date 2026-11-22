// ============================================================
// FILE:   backend/src/routes/auth.routes.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { login, me, changePassword } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { loginSchema, changePasswordSchema } = require("../validators/schemas");

// Brute-force protection on the login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: (req) => ({
    success: false,
    message: req.t("auth.tooManyAttempts"),
  }),
});

router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/me", protect, me);
router.patch(
  "/password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);

module.exports = router;
