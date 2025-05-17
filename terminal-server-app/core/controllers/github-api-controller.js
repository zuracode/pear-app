import fetch from 'bare-fetch';

import { GITHUB_API_URL, GITHUB_API_USERS_PATH } from '../constants';

export class GithubApiController {
    async getUserInfo(username) {
        try {
            const response = await fetch(
                `${GITHUB_API_URL}/${GITHUB_API_USERS_PATH}/${username}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const user = await response.json();

            return user;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    async getUserRepos(username) {
        try {
            const response = await fetch(
                `${GITHUB_API_URL}/${GITHUB_API_USERS_PATH}/${username}/repos?per_page=10&page=1`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const repos = await response.json();

            return repos;
        } catch (error) {
            console.error('Error fetching repos:', error);
        }
    }
}
