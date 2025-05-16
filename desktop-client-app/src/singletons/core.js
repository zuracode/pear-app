import Hypercore from 'hypercore';

export const coreInstance = new Hypercore(
    path.join(Pear.config.storage, 'read-storage')
);
