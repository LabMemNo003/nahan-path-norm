'use strict';

module.exports = PathNorm;

function PathNorm({
    continuous_slashes = true,
    add_trailing_slash = false,
    del_trailing_slash = false,
    res_status_code = 302,
} = {}) {

    if (![301, 302].includes(res_status_code))
        throw new Error('Invalid response status code.');

    if (add_trailing_slash && del_trailing_slash)
        throw new Error(
            'Not allow to enable "add_trailing_slash"' +
            ' and "del_trailing_slash" at same time.'
        );

    const detectors = [];
    if (continuous_slashes) detectors.push(detector_continuous_slashes);
    if (add_trailing_slash) detectors.push(detector_add_trailing_slash);
    if (del_trailing_slash) detectors.push(detector_del_trailing_slash);

    return async function (ctx, next) {

        let path = ctx.req.url.split('?')[0];
        let flag = false;

        for (let d of detectors) {
            if (d.check(path)) {
                flag = true;
                break;
            }
        }

        if (flag) {
            for (let d of detectors)
                path = d.modify(path);

            ctx.res.statusCode = res_status_code;
            ctx.res.setHeader('Location', path);
            ctx.res.end();
        } else {
            if (ctx.path === undefined)
                ctx.path = path;

            await next();
        }
    }
}

const detector_continuous_slashes = {
    pattern: /\/{2,}/g,
    check(path) { return this.pattern.test(path); },
    modify(path) { return path.replace(this.pattern, '/'); },
};

const detector_add_trailing_slash = {
    check(path) { return path[path.length - 1] !== '/'; },
    modify(path) { return path + '/'; },
};

const detector_del_trailing_slash = {
    check(path) { return path[path.length - 1] === '/'; },
    modify(path) { return path.replace(/\/+$/, ''); },
};
