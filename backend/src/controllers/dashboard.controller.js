const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const GateLog = require('../models/GateLog');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { HOUR_MS, todayRange } = require('../utils/helpers');

// GET /api/dashboard/stats
exports.getStats = asyncHandler(async (_req, res) => {
  const { start, end } = todayRange();
  const overdueBefore = new Date(Date.now() - env.overdueHours * HOUR_MS);

  const [totalAssets, totalEmployees, outside, overdue, outToday, returnedToday, byType, recent] = await Promise.all([
    Asset.countDocuments({ isActive: true }),
    Employee.countDocuments({ isActive: true }),
    GateLog.countDocuments({ status: 'OUT' }),
    GateLog.countDocuments({ status: 'OUT', checkOutAt: { $lt: overdueBefore } }),
    GateLog.countDocuments({ checkOutAt: { $gte: start, $lt: end } }),
    GateLog.countDocuments({ checkInAt: { $gte: start, $lt: end } }),
    GateLog.aggregate([
      { $match: { status: 'OUT' } },
      { $group: { _id: '$assetSnapshot.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    GateLog.find().sort({ updatedAt: -1 }).limit(8).populate('checkOutBy checkInBy', 'fullName').lean(),
  ]);

  const recentActivity = recent.map((log) => {
    const returned = log.status === 'RETURNED';
    return {
      _id: log._id,
      event: returned ? 'return' : 'check-out',
      at: returned ? log.checkInAt : log.checkOutAt,
      by: returned ? log.checkInBy?.fullName : log.checkOutBy?.fullName,
      asset: log.assetSnapshot,
      employee: log.employeeSnapshot,
    };
  });

  res.json({
    success: true,
    data: {
      totals: { totalAssets, totalEmployees, outside, overdue, outToday, returnedToday },
      outsideByType: byType.map((row) => ({ type: row._id, count: row.count })),
      recentActivity,
      overdueHours: env.overdueHours,
    },
  });
});
