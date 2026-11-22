const router = require('express').Router();
const ctrl = require('../controllers/gate.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { checkOutSchema, checkInSchema } = require('../validators/schemas');

router.use(protect);

router.post('/check-out', validate(checkOutSchema), ctrl.checkOut);
router.post('/check-in', validate(checkInSchema), ctrl.checkIn);
router.get('/outside', ctrl.listOutside);
router.get('/history/export', ctrl.exportHistory);
router.get('/history', ctrl.listHistory);

module.exports = router;
