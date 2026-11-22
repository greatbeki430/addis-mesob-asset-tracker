const mongoose = require('mongoose');
const { LOG_STATUS } = require('../constants');

const { Schema } = mongoose;

/**
 * One document = one trip of an asset through the gate (out -> returned).
 * Snapshots keep the audit trail readable even if the asset or employee
 * record is edited or deactivated later. Nothing is ever erased.
 */
const gateLogSchema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },

    assetSnapshot: {
      _id: false,
      serialNumber: { type: String, required: true },
      assetTag: { type: String, default: '' },
      type: { type: String, required: true },
      brand: { type: String, default: '' },
      model: { type: String, default: '' },
    },
    employeeSnapshot: {
      _id: false,
      employeeId: { type: String, required: true },
      fullName: { type: String, required: true },
      department: { type: String, default: '' },
    },

    status: { type: String, enum: Object.values(LOG_STATUS), default: LOG_STATUS.OUT },

    checkOutAt: { type: Date, default: Date.now },
    checkOutBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkOutNote: { type: String, trim: true, maxlength: 300, default: '' },

    checkInAt: Date,
    checkInBy: { type: Schema.Types.ObjectId, ref: 'User' },
    checkInNote: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { timestamps: true }
);

gateLogSchema.index({ status: 1, checkOutAt: -1 });
gateLogSchema.index({ checkOutAt: -1 });
gateLogSchema.index({ employee: 1, status: 1 });
// Database-level guarantee: an asset can have only ONE open (OUT) record at a time.
gateLogSchema.index(
  { asset: 1 },
  { unique: true, partialFilterExpression: { status: LOG_STATUS.OUT }, name: 'one_open_log_per_asset' }
);

gateLogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('GateLog', gateLogSchema);
