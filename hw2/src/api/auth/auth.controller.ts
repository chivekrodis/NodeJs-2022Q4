import { Router } from 'express';
import { asyncErrorHandler, CreateError } from '../../common';
import { verifyUser } from './auth.service';

const router = Router();

router.route('/').post(
  asyncErrorHandler(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
      return next(new CreateError(400, 'Bad request'));
    }

    const data = await verifyUser(req.body, next);

    if (!data) {
      return next();
    }

    res.send(data);
  }),
);
export const authRouter = router;
