import type { MiddlewareResponseHandler } from "astro";

export const onRequest: MiddlewareResponseHandler = ({ locals }, next) => {
    locals.changelogs = [];
    return next();
};
