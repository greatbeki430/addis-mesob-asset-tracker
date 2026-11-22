const router = require('express').Router();
const { listUsers, createUser, updateUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userCreateSchema, userUpdateSchema } = require('../validators/schemas');

router.use(protect, authorize('admin'));

router.route('/').get(listUsers).post(validate(userCreateSchema), createUser);
router.patch('/:id', validate(userUpdateSchema), updateUser);

module.exports = router;
