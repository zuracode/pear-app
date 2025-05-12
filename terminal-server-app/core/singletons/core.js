import Hypercore from 'hypercore';
import { HYPERCORE_WRITE_PATH } from '../configs';
import path from 'bare-path';

export const coreInstance = new Hypercore(
    path.join(Pear.config.storage, HYPERCORE_WRITE_PATH)
);
