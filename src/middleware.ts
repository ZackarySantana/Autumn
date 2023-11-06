import type { MiddlewareResponseHandler } from "astro";
import { exampleChangelog } from "./changelog";

export const onRequest: MiddlewareResponseHandler = ({ locals }, next) => {
    locals.changelogs = exampleChangelog;
    return next();
};
