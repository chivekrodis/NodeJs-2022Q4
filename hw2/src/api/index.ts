import { Router } from 'express';
import { userRouter } from './user';

const router = Router();

router.get('/', (_, res) => {
  res.json('api/v1 route');
});

router.use('/user', userRouter);

export default router;
