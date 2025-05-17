import { html } from 'htm/react';
import { MapPin, Github, LinkIcon, Users } from 'lucide-react';

export const UserInfo = ({ user, notFoundUser }) => {
    console.log({ user });

    if (notFoundUser)
        return html`<p className="text-center mt-5 text-red-700 font-bold">
            User not found
        </p>`;

    if (user)
        return html`<div className="mt-8 animate-fade-in">
            <div className="rounded-lg border-2 border-primary bg-card p-5 ">
                <div className="flex items-start space-x-4">
                    <img
                        src=${user.avatar_url || '/placeholder.svg'}
                        className="h-16 w-16 rounded-full border-2 border-primary"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">
                                ${user.name}
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            @${user.login}
                        </p>
                    </div>
                </div>
                <div>
                    <p className="mt-2 text-sm">${user.bio}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        ${user.location &&
                        html`<div
                            className="flex items-center text-muted-foreground"
                        >
                            <${MapPin} className="h-3.5 w-3.5 mr-1" />
                            <span>{user.location}</span>
                        </div> `}
                        ${user.blog &&
                        html`<div
                            className="flex items-center text-muted-foreground"
                        >
                            <${LinkIcon} className="h-3.5 w-3.5 mr-1" />
                            <a
                                href=${user.blog}
                                className="text-primary hover:underline truncate"
                            >
                                ${user.blog.replace(/^https?:\/\//, '')}
                            </a>
                        </div>`}
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm">
                        <a
                            href=${user.html_url}
                            className="flex items-start text-muted-foreground hover:text-foreground"
                        >
                            <${Github} className="h-4 w-4 mr-1 mt-1" />
                            <span>GitHub Profile</span>
                        </a>
                        <div className="flex items-start text-muted-foreground">
                            <${Users} className="h-4 w-4 mr-1 mt-1" />
                            <span>
                                ${user.followers} followers · ${user.following}
                                ${' '}following
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium"
                                >Public repositories</span
                            >
                            <span className="text-sm font-medium"
                                >${user.public_repos}</span
                            >
                        </div>
                        <div
                            className="mt-2 w-full bg-gray-100 rounded-full h-2.5"
                        >
                            <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full"
                                style=${{
                                    width: `${Math.min(100, (user.public_repos / 30) * 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    return '';
};
