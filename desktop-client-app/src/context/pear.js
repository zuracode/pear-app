/** @typedef {import('pear-interface')} */

import { html } from 'htm/react';
import Hypercore from 'hypercore';
import Hyperswarm from 'hyperswarm';
import HyperBee from 'hyperbee';
import path from 'path';
import ProtomuxRPC from 'protomux-rpc';
import { createContext, useEffect, useRef, useState } from 'react';
import b4a from 'b4a';

export const PearContext = createContext();

export const PearProvider = ({ children }) => {
    const [mainPhaseLoaded, setMainPhaseLoaded] = useState(false);

    const coreSwarmInstance = useRef(new Hyperswarm());
    const messagingSwarmInstance = useRef(new Hyperswarm());
    const coreInstance = useRef();
    const beeInstance = useRef();

    const value = {
        coreSwarmInstance,
        messagingSwarmInstance,
        coreInstance,
        beeInstance,
        mainPhaseLoaded:
            typeof mainPhaseLoaded === 'undefined' ? false : mainPhaseLoaded,
    };

    console.log(
        typeof mainPhaseLoaded === 'undefined' ? false : mainPhaseLoaded
    );

    useEffect(() => {
        messagingSwarmInstance.current.on('connection', async (conn) => {
            const rpc = new ProtomuxRPC(conn);
            const coreKey = await rpc.request('core-key');

            coreInstance.current = new Hypercore(
                path.join(Pear.config.storage, 'read-storage'),
                coreKey
            );

            beeInstance.current = new HyperBee(coreInstance.current, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            await coreInstance.current.ready();

            setMainPhaseLoaded(true);

            coreSwarmInstance.current.on('connection', (coreConn) =>
                coreInstance.current.replicate(coreConn)
            );
            const discovery = coreSwarmInstance.current.join(
                coreInstance.current.discoveryKey
            );

            await discovery.flushed();

            const word = 'zuracode';

            const data = await beeInstance.current.get(word);

            console.log({ data });

            // conn.on('data', (data) => console.log(b4a.toString(data, 'utf-8')));
            // conn.write(
            //     JSON.stringify({
            //         operation: 'user_info_request',
            //         data: 'zuracode',
            //     })
            // );
        });

        messagingSwarmInstance.current.join(
            b4a.from(Pear.config.args[0], 'hex'),
            {
                client: true,
                server: false,
            }
        );

        return () => {
            const { teardown } = Pear;

            teardown(() => {
                messagingSwarmInstance?.current?.destroy();
                coreSwarmInstance?.current?.destroy();
            });
        };
    }, []);

    return html`
        <${PearContext} value=${value}>
            ${children}
        </>
    `;
};
