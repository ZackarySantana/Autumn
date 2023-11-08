import type { Project } from "./lib/changelog";
import { client, database } from "./lib/db";
import { defineMiddleware, sequence } from "astro/middleware";

const secretToken = import.meta.env.SECRET_KEY ?? process.env.SECRET_KEY;

const projects = defineMiddleware(async ({ locals }, next) => {
    locals.projects = await client
        .db(database)
        .collection<Project>("projects")
        .find({})
        .toArray();

    return next();
});

const api = defineMiddleware(async ({ request, url }, next) => {
    if (!url.pathname.startsWith("/api/")) {
        return next();
    }

    const basicAuth = request.headers.get("authorization");

    if (basicAuth) {
        const token = basicAuth.split(" ")[1];
        if (Buffer.from(token, "base64").toString() === secretToken) {
            return next();
        }
    }

    return new Response("Auth required", {
        status: 401,
    });
});

const redirects = defineMiddleware(async ({ locals, url, redirect }, next) => {
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
});

export const onRequest = sequence(projects, api, redirects);
