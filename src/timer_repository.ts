import {ITimerRepository, Timer} from '@essential-projects/timing_contracts';

import {SequelizeConnectionManager} from '@essential-projects/sequelize_connection_manager';

import * as Sequelize from 'sequelize';

import {loadModels} from './model_loader';
import {ITimerAttributes, Timer as TimerModel} from './schemas';

import * as moment from 'moment';
import * as uuid from 'uuid';

export class TimerRepository implements ITimerRepository {

  public config: Sequelize.Options;

  private _timerModel: Sequelize.Model<TimerModel, ITimerAttributes>;
  private _sequelize: Sequelize.Sequelize;
  private _connectionManager: SequelizeConnectionManager;

  constructor(connectionManager: SequelizeConnectionManager) {
    this._connectionManager = connectionManager;
  }

  private get timerModel(): Sequelize.Model<TimerModel, ITimerAttributes> {
    return this._timerModel;
  }

  public async initialize(): Promise<void> {
    this._sequelize = await this._connectionManager.getConnection(this.config);
    this._timerModel = await loadModels(this._sequelize);
  }

  public async getAll(): Promise<Array<Timer>> {

    const result: Array<TimerModel> = await this.timerModel.findAll();
    const runtimeProcessDefinitions: Array<Timer> = result.map(this._convertToTimerRuntimeObject);

    return runtimeProcessDefinitions;
  }

  public async getById(timerId: string): Promise<Timer> {

    const matchingTimer: TimerModel = await this.timerModel.findOne({
      where: {
        timerId: timerId,
      },
    });

    if (!matchingTimer) {
      throw new Error(`timer with id '${timerId}' not found!`);
    }

    const timerRuntimeObject: Timer = this._convertToTimerRuntimeObject(matchingTimer);

    return timerRuntimeObject;
  }

  public async create(timerToStore: Timer): Promise<string> {

    const createParams: any = {
      timerId: uuid.v4(),
      type: timerToStore.type,
      expirationDate: timerToStore.expirationDate ? timerToStore.expirationDate.toDate() : null,
      rule: timerToStore.rule ? JSON.stringify(timerToStore.rule) : null,
      eventName: timerToStore.eventName,
      lastElapsed: timerToStore.lastElapsed,
    };

    const result: TimerModel = await this.timerModel.create(createParams);

    return result.timerId;
  }

  public async removeById(timerId: string): Promise<void> {
    await this.timerModel.destroy({
      where: {
        timerId: timerId,
      },
    });
  }

  public async setLastElapsedById(timerId: string, lastElapsed: Date): Promise<void> {

    const matchingTimer: TimerModel = await this.timerModel.findOne({
      where: {
        timerId: timerId,
      },
    });

    if (!matchingTimer) {
      throw new Error(`timer with id '${timerId}' not found!`);
    }

    matchingTimer.lastElapsed = lastElapsed;

    matchingTimer.save();
  }

  private _convertToTimerRuntimeObject(dataModel: TimerModel): Timer {

    const timer: Timer = new Timer();
    timer.id = dataModel.timerId;
    timer.type = dataModel.type;
    timer.expirationDate = dataModel.expirationDate ? moment(dataModel.expirationDate) : undefined;
    timer.rule = dataModel.rule ? JSON.parse(dataModel.rule) : undefined;
    timer.eventName = dataModel.eventName;
    timer.lastElapsed = dataModel.lastElapsed;

    return timer;
  }
}
