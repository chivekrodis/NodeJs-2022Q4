import { DataTypes, Model } from 'sequelize';
import { client } from '../client';
import { IPermission } from '../types';

export class GroupModel extends Model {
  declare id: string;
  declare name: string;
  declare permissions: IPermission[];
}

export const Groups = client.define<GroupModel>(
  'Groups',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
