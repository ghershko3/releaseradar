# releaseradar

[![GitHub release](https://img.shields.io/github/v/release/ghershko3/releaseradar)](https://github.com/ghershko3/releaseradar/releases)
[![npm version](https://img.shields.io/npm/v/@ghershko/releaseradar.svg)](https://www.npmjs.com/package/@ghershko/releaseradar)
[![license](https://img.shields.io/github/license/ghershko3/releaseradar.svg)](https://github.com/ghershko3/releaseradar/blob/main/LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://www.npmjs.com/package/@ghershko/releaseradar)

> Built on `gh`. A faster way to answer "what shipped since the version in prod?"

releaseradar wraps the GitHub CLI with opinionated shortcuts for teams that release often — especially monorepos with prefixed tags like `api-*` or `worker-*`. Set your org and repo once, then skip the flags and the date math.

**Common workflows**

- `rr releases api-2.1.0` — everything released since prod for one service
- `rr releases api-2.1.0 api-2.1.5` — diff between two deployed versions
- `rr list api --last 7d` — this week's releases for one service
- `rr search "CVE"` — find releases mentioning a keyword

Set `RR_ORG` and `RR_REPO` once; no flags on every command.

## Demo

```bash
$ rr list --last 7d

TAG          DATE             AUTHOR
────────────────────────────────────────
v2.1.5       2025-12-20 09:23  alice
v2.1.4       2025-12-19 16:42  bob

Total: 2 release(s)

$ rr releases v2.1.0 v2.1.5

TAG          DATE             AUTHOR    CHANGES
──────────────────────────────────────────────────
v2.1.5       2025-12-20 09:23  alice    Rate limiting fix
v2.1.4       2025-12-19 16:42  bob      Auth token refresh
v2.1.3       2025-12-19 14:15  charlie  DB connection pool

Total: 3 release(s)
```

## Quick Start

**Install**

```bash
npm i -g @ghershko/releaseradar
# or
pnpm i -g @ghershko/releaseradar
# or
yarn global add @ghershko/releaseradar
```

> **Requirements:** [GitHub CLI](https://cli.github.com/) (`gh`) must be installed and authenticated. releaseradar uses `gh` under the hood — no separate GitHub token setup needed.
>
> ```bash
> brew install gh && gh auth login
> ```

**Configure** (add to `~/.zshrc` or `~/.bashrc`)

```bash
export RR_ORG=myorg
export RR_REPO=myrepo
```

**Use**

```bash
rr list                    # View all releases
rr releases v2.1.0         # Compare since version
rr search "fix"            # Search releases
rr info v2.1.5             # Release details
```

## Commands

```bash
rr releases <from> [to]    # Show releases since a tag, or between two tags
rr list [prefix]           # List all releases (optional: filter by prefix)
rr search <term>           # Search release notes
rr info <tag>              # Get detailed release info
```

**Flags**

- `--org <name>` - Override GitHub organization
- `--repo <name>` - Override repository name
- `--last <N>m|h|d` - Filter `list` to releases in the last N minutes/hours/days (e.g. `24h`, `7d`)

## Features

**Version Comparison**

```bash
$ rr releases v2.1.0

TAG          DATE             AUTHOR    CHANGES
──────────────────────────────────────────────────
v2.1.5       2025-12-20 09:23  alice    Rate limiting fix
v2.1.4       2025-12-19 16:42  bob      Auth token refresh
v2.1.3       2025-12-19 14:15  charlie  DB connection pool

Total: 3 release(s)
```

**Version Range** - Compare between two specific versions (not up to latest)

```bash
$ rr releases v2.1.0 v2.1.5

TAG          DATE             AUTHOR    CHANGES
──────────────────────────────────────────────────
v2.1.5       2025-12-20 09:23  alice    Rate limiting fix
v2.1.4       2025-12-19 16:42  bob      Auth token refresh
v2.1.3       2025-12-19 14:15  charlie  DB connection pool

Total: 3 release(s)
```

**Monorepo Support** - Filter by service prefix

```bash
rr list api                # only api-* releases
rr list --last 24h         # releases from the last 24 hours
rr list api --last 7d      # api-* releases from the last 7 days
rr releases api-1.0.0      # compare API versions
```

**Real Author Detection** - Shows actual developers, not CI bots

**Multi-Repo** - Switch repos with flags

```bash
rr --org myorg --repo backend list
```

## Configuration

**Environment Variables** (recommended)

```bash
export RR_ORG=myorg
export RR_REPO=myrepo
export RR_LIMIT=500        # optional, default: 300
```

**Command Flags** (override env vars)

```bash
rr --org company --repo backend releases v1.0
```

## Troubleshooting

**Command not found**

```bash
npm i -g @ghershko/releaseradar
# or
pnpm i -g @ghershko/releaseradar
# or
yarn global add @ghershko/releaseradar
```

**GitHub CLI missing**

```bash
brew install gh && gh auth login
```

**No releases showing**

- Verify: `rr --org myorg --repo myrepo list`
- Increase limit: `export RR_LIMIT=500`

## License

MIT

---

[Report Bug](https://github.com/ghershko3/releaseradar/issues) · [Request Feature](https://github.com/ghershko3/releaseradar/issues)
