import { ObjectId } from "mongodb";
import type { Message } from "./generate";

export type CommitInformation = {
    url: string;
    mergedAt: Date;
    hash: string;
    message: string;
    prDescription: string;
    generated: Message;
};

export type Changelog = {
    week: Date;
    commits: CommitInformation[];
};

export type Project = {
    _id: ObjectId;
    displayName: string;
    github: {
        owner: string;
        repo: string;
        branch: string;
        key: string;
    };
    changelog: Changelog[];
};

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
