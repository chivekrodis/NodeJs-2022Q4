import { Router } from 'express';
import { groupRouter } from './group';
import { userRouter } from './user';

const router = Router();

router.get('/', (_, res) => {
  res.json('api/v1 route');
});

router.use('/user', userRouter);
router.use('/group', groupRouter);

export default router;
