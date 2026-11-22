const router = require('express').Router();
const ctrl = require('../controllers/employee.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { employeeCreateSchema, employeeUpdateSchema } = require('../validators/schemas');

router.use(protect);

// Security officers + admins
router.get('/lookup/:employeeId', ctrl.lookupEmployee);

// Admin only
router.use(authorize('admin'));
router.route('/').get(ctrl.listEmployees).post(validate(employeeCreateSchema), ctrl.createEmployee);
router.route('/:id').patch(validate(employeeUpdateSchema), ctrl.updateEmployee).delete(ctrl.deactivateEmployee);

module.exports = router;
