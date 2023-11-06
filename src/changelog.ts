export const exampleChangelog = [
    {
        _id: "1",
        githubOwner: "zackarysantana",
        githubRepo: "autumn",
        branch: "main",
        displayName: "Autumn",
        secretKey: "autumn-cl",
        generated: [
            [
                "Current - 11/05/2023",
                "Add a timeline",
                "Add dates",
                "Removed a bad feature",
            ],
            [
                "11/04/2023 - 10/26/2023",
                "Created this feature",
                "That is going well",
            ],
            ["10/25/2023 - 10/18/2023", "NA"],
        ],
        week: new Date(),
        commits: [],
    },
    {
        _id: "2",
        githubOwner: "zackarysantana",
        githubRepo: "autumn",
        branch: "main",
        displayName: "How's It",
        secretKey: "autumn-cl",
        generated: [
            ["11/05/2023 - Current", "Changed this and that", "Very cool"],
            ["10/26/2023 - 11/04/2023", "NA"],
            ["10/18/2023 - 10/25/2023", "This", "And", "that", "Changed"],
        ],
        week: new Date(),
        commits: [],
    },
];

export type Changelog = {
    _id: string;
    githubOwner: string;
    githubRepo: string;
    branch: string;
    displayName: string;
    secretKey: string;
    generated: string[][];
    week: Date;
    commits: {
        hash: string;
        message: string;
        prDescription: string;
    }[];
};

export function GetCurrentChangelog(locals: App.Locals, displayName?: string) {
    const generated = locals.changelogs.find(
        (c) => c.displayName === displayName,
    );

    if (!generated) {
        throw new Error("Page not found");
    }
    return generated as Changelog;
}
