import type { MiddlewareResponseHandler } from "astro";
import type { Project } from "./lib/changelog";
import { client, database } from "./lib/db";

export const onRequest: MiddlewareResponseHandler = async (
    { locals, url, redirect },
    next,
) => {
    locals.projects = await client
        .db(database)
        .collection<Project>("projects")
        .find({})
        .toArray();

    if (url.pathname.startsWith("/api/")) {
        return next();
    }

    const split = url.pathname.split("/");

    if (!url.pathname.startsWith("/changelog/") || split.length > 3) {
        return redirect("/changelog/" + locals.projects[0].displayName, 302);
    }

    const project = locals.projects.find((p) => p.displayName === split[2]);
    if (!project) {
        return redirect("/changelog/" + locals.projects[0].displayName, 302);
    }

    locals.project = project;

    return next();
};
