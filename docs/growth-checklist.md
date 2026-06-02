# Organic Growth Checklist

Manual steps to grow `releaseradar` usage after the unscoped rename.

## 1. Deprecate the old scoped package (one-time, after first unscoped publish)

Run once after `releaseradar@1.0.16` is live on npm:

```bash
npm deprecate @ghershko/releaseradar "Renamed to 'releaseradar' (unscoped). Run: npm i -g releaseradar"
```

Verify:

```bash
npm view @ghershko/releaseradar deprecated
npm view releaseradar version
```

## 2. GitHub repo topics

Add these topics on https://github.com/ghershko3/releaseradar/settings:

- `cli`
- `github-releases`
- `devtools`
- `release-notes`
- `nodejs`

Pin the repo on your GitHub profile.

## 3. Record and embed the demo

1. Record a terminal session:
   ```bash
   asciinema rec demo.cast
   # run: rr list --last 7d, rr releases v2.1.0 v2.1.5, rr list api --last 24h
   # exit with Ctrl+D
   ```
2. Upload: `asciinema upload demo.cast`
3. Replace `PLACEHOLDER` in README.md Demo section with the asciinema ID.

Alternative: record a GIF with `vhs` or `terminalizer` and save to `docs/demo.gif`.

## 4. Awesome list PRs

### awesome-cli-apps

Repo: https://github.com/agarrharr/awesome-cli-apps

Suggested entry (under "Development" or "Git"):

```markdown
- [releaseradar](https://github.com/ghershko3/releaseradar) - Compare, search, and diff GitHub releases from your terminal. Supports version ranges, monorepo prefixes, and time-window filtering.
```

PR title: `Add releaseradar - GitHub release comparison CLI`

### awesome-nodejs

Repo: https://github.com/sindresorhus/awesome-nodejs

Suggested entry (under "Command-line apps"):

```markdown
- [releaseradar](https://github.com/ghershko3/releaseradar) - CLI to list, compare, search, and diff GitHub releases.
```

PR title: `Add releaseradar CLI`

## 5. Launch post draft (dev.to / Show HN)

**Title:** What shipped since Friday? Query GitHub releases from your terminal

**Hook:** On-call engineers and release managers waste time clicking through GitHub's release UI. `releaseradar` (`rr`) gives you version diffs, monorepo filtering, and time windows in one command.

**Body outline:**

1. **The problem** — "What's deployed in prod vs what's in the latest release?" requires multiple GitHub clicks or scripting `gh release list`.
2. **The solution** — `npm i -g releaseradar`, set `RR_ORG`/`RR_REPO`, run `rr`.
3. **Demo commands:**
   ```bash
   rr list --last 7d                    # what shipped this week
   rr releases v2.1.0 v2.1.5            # diff between two versions
   rr list api --last 24h               # monorepo: api service only
   rr search "CVE"                      # find security-related releases
   ```
4. **Differentiators** — version-range diffing, monorepo prefix filter, real author detection (not CI bots), `--last` time windows.
5. **Requirements** — uses GitHub CLI (`gh`) you probably already have.
6. **Links** — npm: https://www.npmjs.com/package/releaseradar, GitHub: https://github.com/ghershko3/releaseradar

**Show HN submission title:** Show HN: releaseradar – compare and diff GitHub releases from the terminal

**Tags (dev.to):** `cli`, `github`, `devtools`, `opensource`, `node`

## 6. Ongoing discovery

- Answer Stack Overflow / Reddit questions about comparing GitHub releases with a genuine answer + tool mention.
- Search GitHub Issues in related repos (`release-please`, `semantic-release`) for pain points releaseradar solves.
- Add a "Used by" or "Who uses this" section to README once you have adopters.
