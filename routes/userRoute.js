const router = require('express').Router();
const userController = require('../controller/userController');

router.route('/sign-up').post(userController.addUser);
router.route('/add-shop').post(userController.addShop);
router.post('/login',userController.login);
router.put('/update',userController.updateUser);
router.delete('/delete',userController.deleteUser);
router.get('/messages',userController.messages);

router.get('/get-users',userController.getUsers);
module.exports = router;