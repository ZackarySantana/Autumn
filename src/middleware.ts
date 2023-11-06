import type { MiddlewareResponseHandler } from "astro";
import { exampleChangelog } from "./changelog";

export const onRequest: MiddlewareResponseHandler = (
    { locals, url, redirect },
    next,
) => {
    locals.changelogs = exampleChangelog;

    if (url.pathname === "/") {
        return redirect("/changelog/" + locals.changelogs[0].displayName, 302);
    }

    return next();
};
