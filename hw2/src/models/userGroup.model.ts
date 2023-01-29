import { DataTypes, Model } from 'sequelize';
import { client } from '../client';

export class UserGroupModel extends Model {
  declare id: string;
  declare userId: string;
  declare groupId: string;
}

export const UserGroups = client.define<UserGroupModel>(
  'UserGroups',
  {
    userGroupId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
