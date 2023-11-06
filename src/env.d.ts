/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable multiline-comment-style */
// eslint-disable multiline-comment-style
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="./changelog" />

declare namespace App {
    interface Locals {
        changelogs: {
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
        }[];
        changelog?: {
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
    }
}
