/** @typedef {import('pear-interface')} */ /* global Pear */
const { teardown, updates, versions } = Pear;

console.log('Pear terminal application running');
console.log(await versions());

updates(() => Pear.reload());

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
