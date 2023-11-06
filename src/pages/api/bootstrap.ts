/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import type { APIRoute } from "astro";
import { getFirstDayOfWeek, isSameDate, type Project } from "src/lib/changelog";
import { generateMessage, type PR } from "src/lib/generate";

export const PUT: APIRoute = async ({ request }) => {
    const { owner, repo, branch, prs, displayName, secretKey } =
        await request.json();
    if (!owner || !repo || !branch || !prs) {
        return new Response(null, {
            status: 400,
        });
    }

    const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=${prs}&base=${branch}&is=merged`,
        {},
    );
    const data = (await resp.json()) as PR[];
    const projectInfo = {
        _id: "project",
        displayName: displayName ?? repo,
        github: {
            owner,
            repo,
            branch,
            key: secretKey ?? "",
        },
        changelog: [],
    } as Project;

    const promises: Promise<void>[] = [];
    for (const pr of data) {
        const log = {
            hash: pr.merge_commit_sha,
            message: pr.title,
            prDescription: pr.body,
            generated: [] as string[],
        };
        promises.push(
            generateMessage(pr, data).then((messages) => {
                log.generated = messages;
            }),
        );
        let changelog = projectInfo.changelog.find((cl) =>
            isSameDate(cl.week, getFirstDayOfWeek(new Date(pr.created_at))),
        );
        if (!changelog) {
            changelog = {
                week: getFirstDayOfWeek(new Date(pr.created_at)),
                commits: [],
            };
            projectInfo.changelog.push(changelog);
        }
        changelog.commits.push(log);
    }

    await Promise.all(promises);

    console.log(projectInfo);

    return new Response(null, {
        status: 200,
    });
};
