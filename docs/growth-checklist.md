# Organic Growth Checklist

Manual steps to grow `releaseradar` usage after the unscoped rename.

## Status

| Step | Status |
|------|--------|
| Merge rename to main | Done (PR #4) |
| GitHub repo topics | Done (`cli`, `github-releases`, `devtools`, `release-notes`, `nodejs`) |
| README badges fixed | Done (GitHub release + license work now; npm badge turns green after publish) |
| Publish `releaseradar` to npm | **Blocked** — see step 0 below |
| Deprecate `@ghershko/releaseradar` | Waiting on publish |
| awesome-cli-apps PR | [PR #1118](https://github.com/agarrharr/awesome-cli-apps/pull/1118) |
| awesome-nodejs PR | Blocked — repo restricts PRs to prior contributors |
| Pin repo on GitHub profile | Manual — do on your profile |
| Record demo / launch post | Manual |

## 0. Fix npm publish (required — badges stay red until this is done)

CI publish failed because npm Trusted Publishing is configured for `@ghershko/releaseradar`, not the new unscoped name `releaseradar`.

**Option A — manual first publish (fastest):**

```bash
npm login
git clone https://github.com/ghershko3/releaseradar.git && cd releaseradar
npm publish --access public
```

Then add a Trusted Publisher for `releaseradar` on npm (same GitHub repo/workflow) so future CI publishes work.

**Option B — configure Trusted Publisher first:**

1. Go to [npm Trusted Publishers](https://www.npmjs.com/settings/~your-username/publishers)
2. Add publisher for package name `releaseradar`, repo `ghershko3/releaseradar`, workflow `publish.yml`
3. Re-run the failed workflow: `gh workflow run "Publish to NPM" --repo ghershko3/releaseradar`

After publish succeeds, verify:

```bash
npm view releaseradar version   # should show 1.0.17
```

## 1. Deprecate the old scoped package (one-time, after first unscoped publish)

Run once after `releaseradar@1.0.17` is live on npm:

```bash
npm deprecate @ghershko/releaseradar "Renamed to 'releaseradar' (unscoped). Run: npm i -g releaseradar"
```

Verify:

```bash
npm view @ghershko/releaseradar deprecated
npm view releaseradar version
```

## 2. GitHub repo topics

Done via `gh repo edit`. Topics: `cli`, `github-releases`, `devtools`, `release-notes`, `nodejs`.

**Still manual:** Pin the repo on your GitHub profile (Profile → Customize → Pinned repositories).

## 3. Demo section

README uses static terminal output (no broken asciinema placeholder). Optional upgrade:

```bash
brew install asciinema
asciinema rec demo.cast
# run: rr list --last 7d, rr releases v2.1.0 v2.1.5, rr list api --last 24h
asciinema upload demo.cast
```

## 4. Awesome list PRs

### awesome-cli-apps — submitted

PR: https://github.com/agarrharr/awesome-cli-apps/pull/1118

### awesome-nodejs — blocked

Repo restricts PRs to prior contributors. Options:
- Open an issue requesting the entry be added
- Become a prior contributor with a smaller accepted PR first

Suggested entry (under "Command-line apps"):

```markdown
- [releaseradar](https://github.com/ghershko3/releaseradar) - CLI to list, compare, search, and diff GitHub releases.
```

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
