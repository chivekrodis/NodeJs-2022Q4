import { Router, Request, Response, NextFunction } from 'express';
import { asyncErrorHandler, asyncErrorHandlerWithParams, CreateError } from '../../common';
import { isUUID } from '../../utils';
import { ISuggestParams, IUserRequest, IUserToResponseUser } from './user.model';
import { userService } from './user.service';
import { userSchemaValidation } from './user.validation';

const router = Router();

router.get(
  '/',
  asyncErrorHandler(async (req: Request, res: Response<IUserToResponseUser[]>) => {
    const users = await userService.getAll();

    res.json(users);
  }),
);

router.get(
  '/suggestion',
  userSchemaValidation.suggestUserSchema,
  asyncErrorHandler(async (req: Request, res: Response<IUserToResponseUser | unknown>) => {
    const {
      query: { query: queryString, limit },
    } = req;
    const suggestQuery = { query: queryString, limit } as ISuggestParams;

    const users = await userService.getAutoSuggestUser(suggestQuery);

    res.send(users);
  }),
);

router
  .post(
    '/addUsersToGroup',
    asyncErrorHandler(async (req: Request, res: Response<IUserToResponseUser | unknown>) => {
      const {
        body: { userIds, groupId },
      } = req;

      const response = await userService.addUsersToGroup(groupId as string, userIds as string[]);

      res.status(201).send(response);
    }),
  )
  .post(
    '/',
    userSchemaValidation.createUserSchema,
    asyncErrorHandler(async (req: Request, res: Response<IUserToResponseUser | unknown>) => {
      const newUser = await userService.createUser(req.body);

      if (newUser) {
        return res.status(201).send(newUser);
      }

      res.status(400).send('Login already exist');
    }),
  );

router
  .param(
    'userId',
    asyncErrorHandlerWithParams(async (req: IUserRequest, res: Response, next: NextFunction, id: string) => {
      if (!id || !isUUID(id)) {
        return res.send('Param is not UUID');
      }

      const user = await userService.getById(id);

      if (user) {
        req.user = user;
      } else {
        return next(new CreateError(404, 'Not found'));
      }

      return next();
    }),
  )
  .get(
    '/:userId',
    asyncErrorHandler(async (req: IUserRequest, res: Response<IUserToResponseUser>) => {
      const { user } = req;

      res.json(user);
    }),
  )
  .put(
    '/:userId',
    userSchemaValidation.updateUserSchema,
    asyncErrorHandler(async (req: IUserRequest, res: Response<IUserToResponseUser | unknown>) => {
      const {
        user,
        params: { userId },
      } = req;

      const updatedData = await userService.updateUser(userId, { ...user?.toJSON(), ...req.body });

      res.send(updatedData);
    }),
  )
  .delete(
    '/:userId',
    asyncErrorHandler(async (req: IUserRequest, res: Response<string>) => {
      const { userId } = req.params;
      const deletedUserId = await userService.deleteUser(userId);

      if (deletedUserId) {
        res.send(deletedUserId);
      }
    }),
  );

export const userRouter = router;
