export const exampleChangelog = [
    {
        githubOwner: "zackarysantana",
        githubRepo: "autumn",
        branch: "main",
        displayName: "Autumn",
        secretKey: "autumn-cl",
        generated: [],
        week: new Date(),
        commits: [],
    },
    {
        githubOwner: "zackarysantana",
        githubRepo: "autumn",
        branch: "main",
        displayName: "How's It",
        secretKey: "autumn-cl",
        generated: [],
        week: new Date(),
        commits: [],
    },
];

export type Changelog = {
    githubOwner: string;
    githubRepo: string;
    branch: string;
    displayName: string;
    secretKey: string;
    generated: string[];
    week: Date;
    commits: {
        hash: string;
        message: string;
        prDescription: string;
    }[];
};
