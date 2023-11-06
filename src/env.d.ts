/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable multiline-comment-style */
// eslint-disable multiline-comment-style
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference path="./changelog" />

declare namespace App {
    interface Locals {
        projects: {
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
                commits: {
                    hash: string;
                    message: string;
                    prDescription: string;
                    generated: string[];
                }[];
            }[];
        }[];
        project?: {
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
                commits: {
                    hash: string;
                    message: string;
                    prDescription: string;
                    generated: string[];
                }[];
            }[];
        };
    }
}
