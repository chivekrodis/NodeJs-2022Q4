import { Router } from 'express';
import { groupRouter } from './group';
import { userRouter } from './user';
import { authRouter, checkAuth } from './auth';

const router = Router();

router.get('/', (_, res) => {
  res.json('api/v1 route');
});

router.use('/login', authRouter);
router.use('/user', checkAuth, userRouter);
router.use('/group', checkAuth, groupRouter);

export default router;
