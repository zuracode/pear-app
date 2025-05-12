/** @typedef {import('pear-interface')} */
import { swarmInstance } from './core/singletons/swarm';
import { coreInstance } from './core/singletons/core';
import { beeInstance } from './core/singletons/bee';
import b4a from 'b4a';

/**
 * First step: configuring application
 */
console.log('pear terminal application running...');

Pear.teardown(() => swarmInstance.destroy());

/**
 * Second step: get started with setting app storage and peer-to-peer connection
 */
await coreInstance.ready();

console.log('hypercore key:', b4a.toString(coreInstance.key, 'hex'));

swarmInstance.on('connection', async (conn) => {
    coreInstance.replicate(conn);

    await beeInstance.put('key', 'value');
    console.log(await beeInstance.get('key'));
    // conn.on('data', () => {
    //     bee.put('key', 'value');
    // });
});

swarmInstance.join(coreInstance.discoveryKey);

// connection listener
// data listener
// when data will be channeled need to call axios api

/**
 * swarm, bee setup
 *
 * 1. create file(singleton) for swarm
 * 2. create file(singleton) for bee
 */

/**
 * axios api call(controller, model)
 */
