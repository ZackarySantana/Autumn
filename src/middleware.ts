import type { MiddlewareResponseHandler } from "astro";

export const onRequest: MiddlewareResponseHandler = ({ locals }, next) => {
    if (!locals) {
    }
    return next();
};
