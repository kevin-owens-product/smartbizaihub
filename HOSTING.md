# Hosting

smartbizaihub.com is served by the **owens-sites** service
(`/Users/kevinowens/code/owens-sites`), a single Node server that hosts all of
the sites on one Render instance. This repo contains no hosting config of its
own.

## How it is built there

owens-sites clones this repo at `main` and runs:

| Step | Command |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |

The contents of `dist/` are what gets served.

## Where the config lives

Domain, aliases (`www.smartbizaihub.com` -> `smartbizaihub.com`), SPA fallback,
404 document, redirects, security headers/CSP, cache rules and the allowed form
names are all in:

```
owens-sites/hosts/smartbizaihub.com.json
```

Changing that file requires a redeploy of owens-sites - host configs are read
once at startup.

## Forms

The "Schedule a Demo" form posts same-origin to `POST /api/inquiry` with
`form_name: schedule-a-demo`. Submissions land in the owens-sites inbox
(`/admin`). No third-party form backend is used.
