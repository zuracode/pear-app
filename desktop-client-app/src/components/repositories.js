import { html } from 'htm/react';
import { LinkIcon } from 'lucide-react';

import { useForm } from '../context/form';

export const Repositories = () => {
    const { currentRepositories } = useForm();

    if (!currentRepositories?.length) return '';

    return html`<div
        className="mt-8 rounded-lg border-2 border-primary bg-card py-2 px-4"
    >
        ${currentRepositories?.map(
            (repo, index) =>
                html`<li key="${index}" className="flex items-center space-y-1">
                    <span
                        className="h-2 w-2 bg-gray-400 rounded-full mr-3"
                    ></span>
                    <span className="font-medium mr-auto">${repo.name}</span>
                    <a
                        href="${repo.html_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                    >
                        <${LinkIcon} className="h-5 w-5" />
                    </a>
                </li>`
        )}
    </div>`;
};
