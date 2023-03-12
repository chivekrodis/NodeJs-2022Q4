import { Router, Request, Response, NextFunction } from 'express';
import { asyncErrorHandler, asyncErrorHandlerWithParams, CreateError } from '../../common';
import { isUUID } from '../../utils';
import { IGroup, IGroupRequest } from './group.model';
import { groupService } from './group.service';
import { groupSchemaValidation } from './group.validation';

const router = Router();

router.get(
  '/',
  asyncErrorHandler(async (req: Request, res: Response<IGroup[]>) => {
    const groups = await groupService.getAll();

    res.json(groups);
  }),
);

router.post(
  '/',
  groupSchemaValidation.createGroupSchema,
  asyncErrorHandler(async (req: Request, res: Response<IGroup | unknown>) => {
    const newGroup = await groupService.createGroup(req.body);

    res.status(201).send(newGroup);
  }),
);

router
  .param(
    'groupId',
    asyncErrorHandlerWithParams(async (req: IGroupRequest, res: Response, next: NextFunction, id: string) => {
      if (!id || !isUUID(id)) {
        res.send('Param is not UUID');
      }

      const group = await groupService.getById(id);

      if (group) {
        req.group = group;
      } else {
        return next(new CreateError(404, 'Not found'));
      }

      return next();
    }),
  )
  .get('/:groupId', async (req: IGroupRequest, res: Response<IGroup>) => {
    const { group } = req;

    res.json(group);
  })
  .put(
    '/:groupId',
    groupSchemaValidation.updateGroupSchema,
    asyncErrorHandler(async (req: IGroupRequest, res: Response<IGroup | unknown>) => {
      const {
        group,
        params: { groupId },
      } = req;

      if (group) {
        const updatedData = await groupService.updateGroup(groupId, group?.toJSON(), req.body);

        res.send(updatedData);
      }
    }),
  )
  .delete(
    '/:groupId',
    asyncErrorHandler(async (req: IGroupRequest, res: Response<string>) => {
      const { groupId } = req.params;
      const deletedGroupId = await groupService.deleteGroup(groupId);

      if (deletedGroupId) {
        res.send(deletedGroupId);
      }
    }),
  );

export const groupRouter = router;
