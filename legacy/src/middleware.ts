import type { Project } from "./lib/changelog";
import { client, database } from "./lib/db";
import { defineMiddleware, sequence } from "astro/middleware";

const secretToken = import.meta.env.SECRET_KEY ?? process.env.SECRET_KEY;

const redirectToDefaultProject = async (): Promise<string> => {
    const someProject = await client
        .db(database)
        .collection<Project>("projects")
        .findOne({});
    if (!someProject) {
        return "/unknown";
    }
    return "/changelog/" + someProject.displayName;
};

const api = defineMiddleware(async ({ request, url }, next) => {
    if (!url.pathname.startsWith("/api/")) {
        return next();
    }

    const basicAuth = request.headers.get("authorization");

    if (basicAuth) {
        const token = basicAuth.split(" ")[1];
        if (!token) {
            return new Response("Auth required", {
                status: 401,
            });
        }
        if (Buffer.from(token, "base64").toString() === secretToken) {
            return next();
        }
    }

    return new Response("Auth required", {
        status: 401,
    });
});

const redirects = defineMiddleware(async ({ locals, url, redirect }, next) => {
    if (url.pathname.startsWith("/api/") || url.pathname === "/unknown") {
        return next();
    }

    const split = url.pathname.split("/");

    if (!url.pathname.startsWith("/changelog/") || split.length > 3) {
        return redirect(await redirectToDefaultProject(), 302);
    }

    const project = await client
        .db(database)
        .collection<Project>("projects")
        .findOne({ displayName: split[2] });

    if (!project) {
        return redirect(await redirectToDefaultProject(), 302);
    }

    locals.project = project;

    return next();
});

export const onRequest = sequence(api, redirects);
