const router = require('express').Router();
const ctrl = require('../controllers/asset.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { assetCreateSchema, assetUpdateSchema } = require('../validators/schemas');

router.use(protect);

// Security officers + admins
router.get('/lookup/:code', ctrl.lookupAsset);

// Admin only
router.use(authorize('admin'));
router.route('/').get(ctrl.listAssets).post(validate(assetCreateSchema), ctrl.createAsset);
router.route('/:id').patch(validate(assetUpdateSchema), ctrl.updateAsset).delete(ctrl.deactivateAsset);

module.exports = router;
