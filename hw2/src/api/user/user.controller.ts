import { Router, Request, Response } from 'express';
import { ZodError } from 'zod';
import { IError } from '../../types/error.model';
import { getValidationErrors } from '../../utils';
import { IUserToResponseUser, SuggestSchema, UpdateUserSchema, User, UserSchema } from './user.model';
import { userService } from './user.service';

const router = Router();

router.get('/', (_, res: Response<IUserToResponseUser[]>) => {
  const users = userService.getAll();

  res.json(users.map(User.toResponse));
});

router
  .get('/suggestion', (req: Request, res: Response<IUserToResponseUser | IError[] | unknown>) => {
    try {
      const validateInput = SuggestSchema.parse(req.body);

      const users = userService.getAutoSuggestUser(validateInput);

      res.send(users.map(User.toResponse));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(getValidationErrors(error));
      } else {
        res.send(error);
      }
    }
  })
  .get('/:userId', (req: Request, res: Response<IUserToResponseUser | string>) => {
    const { userId } = req.params;
    const user = userService.getById(userId);

    if (user) {
      res.json(User.toResponse(user));
    } else {
      res.status(404).send('Not found');
    }
  });

router.post('/', (req: Request, res: Response<IUserToResponseUser | IError[] | unknown>) => {
  try {
    const validateUser = UserSchema.parse(req.body);
    userService.createUser(validateUser);

    res.status(201).send(User.toResponse(validateUser));
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send(getValidationErrors(error));
    } else {
      res.send(error);
    }
  }
});

router.put('/:userId', (req: Request, res: Response<IUserToResponseUser | IError[] | unknown>) => {
  try {
    const { userId } = req.params;
    const validateUser = UpdateUserSchema.parse(req.body);

    const updatedData = userService.updateUser(userId, validateUser);

    if (!updatedData) {
      res.status(404).send('Not found');
    } else {
      res.send(User.toResponse(updatedData));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send(getValidationErrors(error));
    } else {
      res.send(error);
    }
  }
});

router.delete('/:userId', (req: Request, res: Response<string>) => {
  const { userId } = req.params;
  const deletedUserId = userService.deleteUser(userId);

  if (deletedUserId) {
    res.send(deletedUserId);
  } else {
    res.status(404).send('Not found');
  }
});

export const userRouter = router;
