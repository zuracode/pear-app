/** @typedef {import('pear-interface')} */

import b4a from 'b4a';
import ProtomuxRPC from 'protomux-rpc';

import {
    coreSwarmInstance,
    messagingSwarmInstance,
} from './core/singletons/swarm';
import { coreInstance } from './core/singletons/core';
import crypto from 'hypercore-crypto';

import { PutDataController } from './core/controllers/put-data-controller';
import { isValidJson } from './core/utils/is-valid-json';

import {
    PUT_USER_INFO_OPERATION_NAME,
    PUT_REPOS_OPERATION_NAME,
} from './core/constants';

Pear.teardown(() => coreSwarmInstance.destroy());

await coreInstance.ready();

// swarm for sending user name from client to server
const clientServerPeerToPeerTopicBuffer = crypto.randomBytes(32);

messagingSwarmInstance.on('connection', async (conn) => {
    // send swarm key to client
    const rpc = new ProtomuxRPC(conn);

    rpc.respond('core-key', () => coreInstance.key);

    // set up userCore swarm
    coreSwarmInstance.on('connection', async (coreConn) => {
        coreInstance.replicate(coreConn);
    });

    coreSwarmInstance.join(coreInstance.discoveryKey);

    conn.on('data', async (data) => {
        const decodedData = b4a.toString(data, 'utf-8');

        if (isValidJson(decodedData)) {
            const jsonData = JSON.parse(decodedData);

            const operationData = jsonData?.data;
            const operationName = jsonData?.operation;

            if (operationData?.length) {
                const putDataControllerInstance = new PutDataController();

                if (operationName === PUT_USER_INFO_OPERATION_NAME) {
                    const userInfo =
                        await putDataControllerInstance.uploadUserInfo(
                            operationData
                        );

                    conn.write(JSON.stringify(userInfo));
                } else if (operationName === PUT_REPOS_OPERATION_NAME) {
                    await putDataControllerInstance.uploadRepos(operationData);
                }
            }
        }
    });
});

messagingSwarmInstance.join(clientServerPeerToPeerTopicBuffer, {
    client: false,
    server: true,
});

console.log(
    'topic hex:',
    b4a.toString(clientServerPeerToPeerTopicBuffer, 'hex')
);
