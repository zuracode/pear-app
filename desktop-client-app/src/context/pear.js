/** @typedef {import('pear-interface')} */

import { html } from 'htm/react';
import Hypercore from 'hypercore';
import Hyperswarm from 'hyperswarm';
import HyperBee from 'hyperbee';
import path from 'path';
import ProtomuxRPC from 'protomux-rpc';
import { createContext, useEffect, useRef, useState, useContext } from 'react';

const initializationMessages = {
    pendingDHT: 'waits for any pending DHT announcements',
    cloneData: 'data cloning phase',
};

export const PearContext = createContext(undefined);

export const PearProvider = ({ children }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [initializationPhase, setInitializationPhase] = useState(
        initializationMessages.cloneData
    );

    const coreSwarmInstance = useRef(new Hyperswarm());
    const coreInstance = useRef();
    const beeInstance = useRef();
    const rpcInstance = useRef();

    const value = {
        coreSwarmInstance,
        coreInstance,
        beeInstance,
        rpcInstance,
        isInitializing:
            typeof isInitializing === 'undefined' ? false : isInitializing,
        initializationPhase,
    };

    useEffect(() => {
        async function init() {
            const coreSwarm = new Hyperswarm();

            coreInstance.current = new Hypercore(
                path.join(Pear.config.storage, 'read-storage'),
                Pear.config.args[0]
            );

            beeInstance.current = new HyperBee(coreInstance.current, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            await coreInstance.current.ready();

            coreSwarm.join(coreInstance.current.discoveryKey, {
                client: true,
                server: false,
            });

            coreSwarm.on('connection', (conn) => {
                coreInstance.current.replicate(conn);
                rpcInstance.current = new ProtomuxRPC(conn);
            });

            setInitializationPhase(initializationMessages.pendingDHT);

            // await coreSwarm.flush();

            setIsInitializing(true);
            setInitializationPhase('');
        }

        init();

        return () => {
            const { teardown } = Pear;

            teardown(() => {
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

export const usePear = () => {
    const context = useContext(PearContext);

    if (context === undefined) {
        throw new Error('useForm must be used within a FormProvider');
    }

    return context;
};
