export type Project = {
    _id: string;
    displayName: string;
    github: {
        owner: string;
        repo: string;
        branch: string;
        key: string;
    };
    changelog: {
        week: Date;
        generated: string[];
        commits: {
            hash: string;
            message: string;
            prDescription: string;
        }[];
    }[];
};

export const exampleChangelog = [
    {
        _id: "1",
        displayName: "Autumn",
        github: {
            owner: "zackarysantana",
            repo: "autumn",
            branch: "main",
            key: "autumn-cl",
        },
        changelog: [
            {
                week: new Date(),
                generated: ["First change", "Second change"],
                commits: [
                    {
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                    },
                ],
            },
        ],
    },
    {
        _id: "1",
        displayName: "How's It",
        github: {
            owner: "zackarysantana",
            repo: "howsit",
            branch: "main",
            key: "howsit",
        },
        changelog: [
            {
                week: new Date(),
                generated: ["Crazy chnage", "yeah.."],
                commits: [
                    {
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                    },
                ],
            },
            {
                week: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                generated: ["Crazy chnage", "yeah.."],
                commits: [
                    {
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                    },
                ],
            },
        ],
    },
] satisfies Project[];

export function GetCurrentChangelog(locals: App.Locals, displayName?: string) {
    const project = locals.projects.find((c) => c.displayName === displayName);

    if (!project) {
        throw new Error("Page not found");
    }
    return project as Project;
}
