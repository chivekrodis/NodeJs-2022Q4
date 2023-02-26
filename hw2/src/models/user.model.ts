import { DataTypes, Model, Transactionable } from 'sequelize';
import { IUser } from '../api/user/user.model';
import { client } from '../client';
import { Groups } from './group.model';
import { UserGroupModel, UserGroups } from './userGroup.model';

export class UserModel extends Model<Partial<IUser>> {
  declare id: string;
  declare login: string;
  declare password: string;
  declare age: number;
  declare isDeleted: boolean;
  declare addGroups: (id: string, { transaction }: Transactionable) => void;
  declare getGroups: () => UserGroupModel[];
  declare removeGroups: (id: string, { transaction }: Transactionable) => void;
}

export const Users = client.define<UserModel>(
  'Users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 4,
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    defaultScope: {
      attributes: {
        exclude: ['password', 'isDeleted'],
      },
    },
    hooks: {
      afterCreate: (record) => {
        delete record.dataValues.password;
        delete record.dataValues.isDeleted;
      },
      afterUpdate: (record) => {
        delete record.dataValues.password;
        delete record.dataValues.isDeleted;
      },
    },
  },
);

Users.belongsToMany(Groups, { through: UserGroups, foreignKey: 'userId', otherKey: 'groupId' });
Groups.belongsToMany(Users, { through: UserGroups, foreignKey: 'groupId', otherKey: 'userId' });
