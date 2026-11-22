// ============================================================
// FILE:   backend/src/models/Employee.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "validation.employeeIdRequired"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 30,
    },
    fullName: {
      type: String,
      required: [true, "validation.fullNameRequired"],
      trim: true,
      maxlength: 100,
    },
    department: { type: String, trim: true, maxlength: 100, default: "" },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

employeeSchema.index({ fullName: 1 });

employeeSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
