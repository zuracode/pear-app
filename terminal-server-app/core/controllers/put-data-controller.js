import Hyperbee from 'hyperbee';

import { coreInstance } from '../singletons/core';
import { GithubApiController } from './github-api-controller';

export class PutDataController {
    #githubApiController;

    constructor() {
        this.#githubApiController = new GithubApiController();
    }

    async uploadUserInfo(username) {
        try {
            const bee = new Hyperbee(coreInstance, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            const user = await this.#githubApiController.getUserInfo(username);

            await bee.put(username, user);
            const userFromBee = await bee.get(username);

            return userFromBee.value;
        } catch (e) {
            console.log(e);
        }
    }

    async uploadRepos(username) {
        try {
            const bee = new Hyperbee(coreInstance, {
                keyEncoding: 'utf-8',
                valueEncoding: 'json',
            });

            const repos = await this.#githubApiController.getUserRepos();

            await bee.put(`${username}-repos`, repos);
            const reposFromBee = await bee.get(username);

            return reposFromBee;
        } catch (e) {
            console.log(e);
        }
    }
}
