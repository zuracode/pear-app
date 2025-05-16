import path from 'bare-path';
import Hypercore from 'hypercore';

export const coreInstance = new Hypercore(
    path.join(Pear.config.storage, 'write-storage')
);
