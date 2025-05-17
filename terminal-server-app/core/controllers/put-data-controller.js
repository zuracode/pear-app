import Hyperbee from 'hyperbee';
import equal from 'fast-deep-equal';

import { coreInstance } from '../singletons/core';
import { GithubApiController } from './github-api-controller';

export class PutDataController {
    #githubApiController;

    constructor() {
        this.#githubApiController = new GithubApiController();
    }

    #objectOrArrayCas(prev, next) {
        return equal(prev, next);
    }

    async uploadUserInfo(username) {
        try {
            const bee = new Hyperbee(coreInstance, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            const user = await this.#githubApiController.getUserInfo(username);

            if (!user) return null;

            await bee.put(username, user, {
                cas: this.#objectOrArrayCas,
            });
            const userFromBee = await bee.get(username);

            return userFromBee.value;
        } catch (e) {
            console.log(e);
        }
    }

    async uploadRepos(username) {
        try {
            const key = `${username}-repos`;

            const bee = new Hyperbee(coreInstance, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            const repos =
                await this.#githubApiController.getUserRepos(username);

            if (!repos) return null;

            await bee.put(key, repos, {
                cas: this.#objectOrArrayCas,
            });
            const reposFromBee = await bee.get(key);

            return reposFromBee.value;
        } catch (e) {
            console.log(e);
        }
    }
}
