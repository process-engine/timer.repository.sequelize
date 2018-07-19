import * as Sequelize from 'sequelize';

import {
  defineTimer,
  ITimerAttributes,
  Timer,
} from './schemas/index';

export async function loadModels(sequelizeInstance: Sequelize.Sequelize): Promise<Sequelize.Model<Timer, ITimerAttributes>> {

  const timerModel: Sequelize.Model<Timer, ITimerAttributes> = defineTimer(sequelizeInstance);

  await sequelizeInstance.sync();

  return timerModel;
}
