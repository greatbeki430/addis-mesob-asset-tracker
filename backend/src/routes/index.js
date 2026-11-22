const router = require('express').Router();

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/employees', require('./employee.routes'));
router.use('/assets', require('./asset.routes'));
router.use('/gate', require('./gate.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
