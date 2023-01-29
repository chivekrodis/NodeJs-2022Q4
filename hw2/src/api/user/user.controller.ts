import { Router, Request, Response, NextFunction } from 'express';
import { isUUID } from '../../utils';
import { ISuggestParams, IUserRequest, IUserToResponseUser } from './user.model';
import { userService } from './user.service';
import { userSchemaValidation } from './user.validation';

const router = Router();

router.get('/', async (req: Request, res: Response<IUserToResponseUser[]>) => {
  const users = await userService.getAll();

  res.json(users);
});

router.get(
  '/suggestion',
  userSchemaValidation.suggestUserSchema,
  async (req: Request, res: Response<IUserToResponseUser | unknown>) => {
    try {
      const {
        query: { query: queryString, limit },
      } = req;
      const suggestQuery = { query: queryString, limit } as ISuggestParams;

      const users = await userService.getAutoSuggestUser(suggestQuery);

      res.send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  },
);

router.post(
  '/',
  userSchemaValidation.createUserSchema,
  async (req: Request, res: Response<IUserToResponseUser | unknown>) => {
    try {
      const newUser = await userService.createUser(req.body);

      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error);
    }
  },
);

router
  .param('userId', async (req: IUserRequest, res: Response, next: NextFunction, id: string) => {
    try {
      if (!isUUID(id)) {
        res.send('Param is not UUID');
      }

      const user = await userService.getById(id);

      if (user) {
        req.user = user;
      } else {
        return res.status(404).send('Not found');
      }

      return next();
    } catch (error) {
      res.send(error);
    }
  })
  .get('/:userId', async (req: IUserRequest, res: Response<IUserToResponseUser>) => {
    const { user } = req;

    res.json(user);
  })
  .put(
    '/:userId',
    userSchemaValidation.updateUserSchema,
    async (req: IUserRequest, res: Response<IUserToResponseUser | unknown>) => {
      try {
        const {
          user,
          params: { userId },
        } = req;

        const updatedData = await userService.updateUser(userId, { ...user?.toJSON(), ...req.body });

        res.send(updatedData);
      } catch (error) {
        res.status(400).send(error);
      }
    },
  )
  .delete('/:userId', async (req: IUserRequest, res: Response<string>) => {
    const { userId } = req.params;
    const deletedUserId = await userService.deleteUser(userId);

    if (deletedUserId) {
      res.send(deletedUserId);
    }
  });

export const userRouter = router;
