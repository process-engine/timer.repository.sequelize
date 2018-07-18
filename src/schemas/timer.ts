import * as Sequelize from 'sequelize';

export interface ITimerAttributes {
  id: string;
  type: number;
  expirationDate?: Date; // Only used, if timer type is "once"
  rule?: string; // Only used, if timer type is "periodic"
  eventName: string;
  lastElapsed?: Date;
}

export type Timer = Sequelize.Instance<ITimerAttributes> & ITimerAttributes;

export function defineTimer(sequelize: Sequelize.Sequelize): any {
  const attributes: SequelizeAttributes<ITimerAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    expirationDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    rule: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    eventName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastElapsed: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  };

  return sequelize.define<Timer, ITimerAttributes>('Timer', attributes);
}
