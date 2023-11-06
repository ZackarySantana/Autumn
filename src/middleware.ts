import type { MiddlewareResponseHandler } from "astro";
import { exampleChangelog } from "./lib/changelog";

export const onRequest: MiddlewareResponseHandler = (
    { locals, url, redirect },
    next,
) => {
    locals.projects = exampleChangelog;

    if (url.pathname === "/") {
        return redirect("/changelog/" + locals.projects[0].displayName, 302);
    }

    return next();
};
