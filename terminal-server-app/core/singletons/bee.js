import Hyperbee from 'hyperbee';
import { coreInstance } from './core';

export const beeInstance = new Hyperbee(coreInstance, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8',
});
