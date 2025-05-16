/** @typedef {import('pear-interface')} */

import ProtomuxRPC from 'protomux-rpc';
import b4a from 'b4a';
import HyperBee from 'hyperbee';
import Hypercore from 'hypercore';
import {
    messagingSwarmInstance,
    coreSwarmInstance,
} from './src/singletons/swarm';
import path from 'path';

const { updates } = Pear;

Pear.teardown(() => swarm.destroy());
updates(() => Pear.reload());

messagingSwarmInstance.on('connection', async (conn) => {
    const rpc = new ProtomuxRPC(conn);
    const coreKey = await rpc.request('core-key');

    const coreInstance = new Hypercore(
        path.join(Pear.config.storage, 'read-storage'),
        coreKey
    );

    const beeInstance = new HyperBee(coreInstance, {
        keyEncoding: 'utf-8',
        valueEncoding: 'json',
    });

    await coreInstance.ready();

    coreSwarmInstance.on('connection', (coreConn) =>
        coreInstance.replicate(coreConn)
    );
    const discovery = coreSwarmInstance.join(coreInstance.discoveryKey);

    await discovery.flushed();

    const word = 'zuracode';

    const data = await beeInstance.get(word);

    console.log('next', data);

    // conn.on('data', (data) => console.log(b4a.toString(data, 'utf-8')));
    // conn.write(
    //     JSON.stringify({
    //         operation: 'user_info_request',
    //         data: 'zuracode',
    //     })
    // );
});

messagingSwarmInstance.join(b4a.from(Pear.config.args[0], 'hex'), {
    client: true,
    server: false,
});
