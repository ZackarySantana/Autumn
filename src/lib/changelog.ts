import { ObjectId } from "mongodb";

export type Project = {
    _id: ObjectId;
    displayName: string;
    github: {
        owner: string;
        repo: string;
        branch: string;
        key: string;
    };
    changelog: {
        week: Date;
        commits: {
            url: string;
            mergedAt: Date;
            hash: string;
            message: string;
            prDescription: string;
            generated: string[];
        }[];
    }[];
};

export const exampleChangelog = [
    {
        _id: new ObjectId(),
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
                commits: [
                    {
                        url: "https://github.com",
                        mergedAt: new Date(),
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                        generated: ["First change", "Second change"],
                    },
                ],
            },
        ],
    },
    {
        _id: new ObjectId(),
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
                commits: [
                    {
                        url: "https://github.com",
                        mergedAt: new Date(),
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                        generated: ["Crazy chnage", "yeah.."],
                    },
                ],
            },
            {
                week: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                commits: [
                    {
                        url: "https://github.com",
                        mergedAt: new Date(),
                        hash: "1",
                        message: "test",
                        prDescription: "test",
                        generated: ["Crazy chnage", "yeah.."],
                    },
                ],
            },
        ],
    },
] satisfies Project[];

export function changelogDate(date: Date): string {
    const startOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay(),
    );
    const endOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + (6 - date.getDay()),
    );
    const currentDate = new Date();

    if (endOfWeek > currentDate) {
        return `Current - ${startOfWeek.toLocaleDateString()}`;
    }

    return `${endOfWeek.toLocaleDateString()} - ${startOfWeek.toLocaleDateString()}`;
}

export function getFirstDayOfWeek(date: Date): Date {
    // get the first day of the week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

export function isSameDate(d1: Date, d2: Date) {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}
