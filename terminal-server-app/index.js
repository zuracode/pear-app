/** @typedef {import('pear-interface')} */

import b4a from 'b4a';
import ProtomuxRPC from 'protomux-rpc';

import { coreSwarmInstance } from './core/singletons/swarm';
import { coreInstance } from './core/singletons/core';

import { PutDataController } from './core/controllers/put-data-controller';
import { isValidJson } from './core/utils/is-valid-json';

import {
    PUT_USER_INFO_OPERATION_NAME,
    PUT_REPOS_OPERATION_NAME,
} from './core/constants';

Pear.teardown(() => coreSwarmInstance.destroy());

await coreInstance.ready();

// core key
console.log('core key:', b4a.toString(coreInstance.key, 'hex'));

coreSwarmInstance.on('connection', async (conn) => {
    coreInstance.replicate(conn);

    const rpc = new ProtomuxRPC(conn);

    rpc.respond('requested-data', async (data) => {
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

                    return b4a.from(JSON.stringify(userInfo), 'utf-8');
                } else if (operationName === PUT_REPOS_OPERATION_NAME) {
                    const repos =
                        await putDataControllerInstance.uploadRepos(
                            operationData
                        );

                    return b4a.from(JSON.stringify(repos), 'utf-8');
                }
            }
        }

        return null;
    });
});

coreSwarmInstance.join(coreInstance.discoveryKey, {
    client: false,
    server: true,
});
