import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, userController.getUsers);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

export default router;