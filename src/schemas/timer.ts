import * as Sequelize from 'sequelize';

export interface ITimerAttributes {
  id: string;
  timerType: number;
  timerIsoString: string;
  timerRule: string;
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
    timerType: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    timerIsoString: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    timerRule: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    eventName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastElapsed: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: undefined,
    },
  };

  return sequelize.define<Timer, ITimerAttributes>('Timer', attributes);
}
