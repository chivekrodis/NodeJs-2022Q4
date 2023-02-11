import { Request } from 'express';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { GroupModel } from '../../models';
import { PERMISSIONS_LIST } from '../../constants';

export const GroupSchema = z.object({
  id: z.string().uuid().optional().default(uuidv4()),
  name: z.string().min(1),
  permissions: z
    .array(z.string())
    .min(1)
    .refine((permissions) => permissions.every((permission) => PERMISSIONS_LIST.includes(permission)), {
      message: 'Invalid permissions',
    }),
});

export const UpdateGroupSchema = GroupSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'Invalid fields',
});

export type IGroup = Pick<GroupModel, 'id' | 'name' | 'permissions'>;

export type IGroupRequest = {
  group?: GroupModel;
} & Request;
export type IGroupToUpdate = z.infer<typeof UpdateGroupSchema>;
