'use strict';

const TimerRepository = require('./dist/commonjs/index').TimerRepository;
const disposableDiscoveryTag = require('@essential-projects/bootstrapper_contracts').disposableDiscoveryTag;

function registerInContainer(container) {

  container.register('TimerRepository', TimerRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:timer_repository')
    .tags(disposableDiscoveryTag)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
