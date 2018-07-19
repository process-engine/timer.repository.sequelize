'use strict';

const TimerRepository = require('./dist/commonjs/index').TimerRepository;

function registerInContainer(container) {

  container.register('TimerRepository', TimerRepository)
    .configure('process_engine:timer_repository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
