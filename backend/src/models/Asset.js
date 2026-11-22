// ============================================================
// FILE:   backend/src/models/Asset.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const mongoose = require("mongoose");
const { ASSET_TYPES, ASSET_STATUS } = require("../constants");

const assetSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: [true, "validation.serialRequired"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 60,
    },
    // Optional internal inventory / property tag printed on the device
    assetTag: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 40,
      default: "",
      index: true,
    },
    type: {
      type: String,
      enum: { values: ASSET_TYPES, message: "validation.invalidAssetType" },
      required: [true, "validation.assetTypeRequired"],
    },
    brand: { type: String, trim: true, maxlength: 60, default: "" },
    model: { type: String, trim: true, maxlength: 80, default: "" },
    notes: { type: String, trim: true, maxlength: 300, default: "" },
    status: {
      type: String,
      enum: Object.values(ASSET_STATUS),
      default: ASSET_STATUS.IN_OFFICE,
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

assetSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Asset", assetSchema);
