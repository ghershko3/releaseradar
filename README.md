# releaseradar

> Query GitHub releases from your terminal. Fast, simple, powerful.

Stop clicking through GitHub's UI. Compare versions, search releases, and track changes - all from the command line.

## Quick Start

**Install**

```bash
npm i -g @ghershko/releaseradar
# or
pnpm i -g @ghershko/releaseradar
# or
yarn global add @ghershko/releaseradar
```

**Setup** (if not already installed)

```bash
brew install gh && gh auth login
```

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
