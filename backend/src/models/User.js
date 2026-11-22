// ============================================================
// FILE:   backend/src/models/User.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "validation.fullNameRequired"],
      trim: true,
      maxlength: 100,
    },
    username: {
      type: String,
      required: [true, "validation.usernameRequired"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9._-]+$/, "validation.usernameChars"],
    },
    password: {
      type: String,
      required: [true, "validation.passwordRequired"],
      minlength: 8,
      select: false,
    },
    role: { type: String, enum: ROLES, default: "security" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
