/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable multiline-comment-style */
// eslint-disable multiline-comment-style
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="./lib/changelog" />

declare namespace App {
    interface Locals {
        project: {
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
                    generated: {
                        changelog: string;
                        type: "Bug Fix" | "Improvement" | "Other";
                        ticket_id: string;
                        impact: 1 | 2 | 3 | 4;
                    };
                }[];
            }[];
        };
    }
}
