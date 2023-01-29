import { Router, Request, Response, NextFunction } from 'express';
import { isUUID } from '../../utils';
import { IGroup, IGroupRequest } from './group.model';
import { groupService } from './group.service';
import { groupSchemaValidation } from './group.validation';

const router = Router();

router.get('/', async (req: Request, res: Response<IGroup[]>) => {
  const users = await groupService.getAll();

  res.json(users);
});

router.post('/', groupSchemaValidation.createGroupSchema, async (req: Request, res: Response<IGroup | unknown>) => {
  try {
    const newGroup = await groupService.createGroup(req.body);

    res.status(201).send(newGroup);
  } catch (error) {
    res.status(400).send(error);
  }
});

router
  .param('groupId', async (req: IGroupRequest, res: Response, next: NextFunction, id: string) => {
    try {
      if (!isUUID(id)) {
        res.send('Param is not UUID');
      }

      const group = await groupService.getById(id);

      if (group) {
        req.group = group;
      } else {
        return res.status(404).send('Not found');
      }

      return next();
    } catch (error) {
      res.send(error);
    }
  })
  .get('/:groupId', async (req: IGroupRequest, res: Response<IGroup>) => {
    const { group } = req;

    res.json(group);
  })
  .put(
    '/:groupId',
    groupSchemaValidation.updateGroupSchema,
    async (req: IGroupRequest, res: Response<IGroup | unknown>) => {
      try {
        const {
          group,
          params: { groupId },
        } = req;

        if (group) {
          const updatedData = await groupService.updateGroup(groupId, group?.toJSON(), req.body);

          res.send(updatedData);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    },
  )
  .delete('/:groupId', async (req: IGroupRequest, res: Response<string>) => {
    const { groupId } = req.params;
    const deletedGroupId = await groupService.deleteGroup(groupId);

    if (deletedGroupId) {
      res.send(deletedGroupId);
    }
  });

export const groupRouter = router;
