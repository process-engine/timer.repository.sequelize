import {ITimerRepository, Runtime} from '@process-engine/process_engine_contracts';

import {getConnection} from '@essential-projects/sequelize_connection_manager';

import * as Sequelize from 'sequelize';

import {loadModels} from './model_loader';
import {ITimerAttributes, Timer as TimerModel} from './schemas';

export class TimerRepository implements ITimerRepository {

  public config: Sequelize.Options;

  private _timerModel: Sequelize.Model<TimerModel, ITimerAttributes>;

  private sequelize: Sequelize.Sequelize;

  private get timerModel(): Sequelize.Model<TimerModel, ITimerAttributes> {
    return this._timerModel;
  }

  public async initialize(): Promise<void> {
    this.sequelize = await getConnection(this.config);
    this._timerModel = await loadModels(this.sequelize);
  }

  public async getAll(): Promise<Array<Runtime.Types.Timer>> {

    const result: Array<TimerModel> = await this.timerModel.findAll();
    const runtimeProcessDefinitions: Array<Runtime.Types.Timer> = result.map(this._convertToTimerRuntimeObject);

    return runtimeProcessDefinitions;
  }

  public async getById(timerId: string): Promise<Runtime.Types.Timer> {

    const matchingTimer: TimerModel = await this.timerModel.findOne({
      where: {
        id: timerId,
      },
    });

    if (!matchingTimer) {
      throw new Error(`timer with id '${timerId}' not found!`);
    }

    const timerRuntimeObject: Runtime.Types.Timer = this._convertToTimerRuntimeObject(matchingTimer);

    return timerRuntimeObject;
  }

  public async create(timerToStore: Runtime.Types.Timer): Promise<string> {

    const createParams: any = {
      timerType: timerToStore.timerType,
      timerIsoString: timerToStore.timerIsoString,
      timerRule: JSON.stringify(timerToStore.timerRule),
      eventName: timerToStore.eventName,
      lastElapsed: timerToStore.lastElapsed,
    };

    const result: TimerModel = await this.timerModel.create(createParams);

    return result.id;
  }

  public async removeById(timerId: string): Promise<void> {
    await this.timerModel.destroy({
      where: {
        id: timerId,
      },
    });
  }

  private _convertToTimerRuntimeObject(dataModel: TimerModel): Runtime.Types.Timer {

    const timer: Runtime.Types.Timer = new Runtime.Types.Timer();
    timer.id = dataModel.id;
    timer.timerType = dataModel.timerType;
    timer.timerIsoString = dataModel.timerIsoString;
    timer.timerRule = JSON.parse(dataModel.timerRule);
    timer.eventName = dataModel.eventName;
    timer.lastElapsed = dataModel.lastElapsed;

    return timer;
  }
}
