/** @typedef {import('pear-interface')} */
/* global Pear */
import Hyperswarm from 'hyperswarm';
import Hypercore from 'hypercore';
import HyperBee from 'hyperbee';

const { updates } = Pear;

const swarm = new Hyperswarm();
Pear.teardown(() => swarm.destroy());
updates(() => Pear.reload());

console.log(Pear.config.args[0]);

const core = new Hypercore(Pear.config.storage, Pear.config.args[0]);

// const bee = new HyperBee(core);

await core.ready();

swarm.join(core.discoveryKey);
swarm.on('connection', (conn) => core.replicate(conn));

await swarm.flush();

let position = core.length;
console.log(`Skipping ${core.length} earlier blocks...`);
for await (const block of core.createReadStream({
    start: core.length,
    live: true,
})) {
    console.log(`Block ${position++}: ${block}`);
}
