# Organic Growth Checklist

Manual steps to grow `@ghershko/releaseradar` usage.

> **Note:** The unscoped rename to `releaseradar` was reverted to preserve the
> existing download history on `@ghershko/releaseradar`. The package stays scoped.

## Revert cleanup (manual — requires npm OTP in your terminal)

These finish undoing the short-lived unscoped publish.

1. **Un-deprecate the scoped package** (it was deprecated during the rename):

   ```bash
   npm deprecate @ghershko/releaseradar ""
   ```

2. **Remove the unscoped package** that was published. It is brand new (published
   today, ~0 downloads), so it can be unpublished within 72 hours:

   ```bash
   npm unpublish releaseradar --force
   ```

   If the 72h window has passed, deprecate it instead:

   ```bash
   npm deprecate releaseradar "Use @ghershko/releaseradar instead."
   ```

3. Verify:

   ```bash
   npm view @ghershko/releaseradar version      # 1.0.18 after next publish
   npm view @ghershko/releaseradar deprecated    # should be empty
   ```

## CI publish

CI publishes via npm Trusted Publishing (OIDC). It was already working for
`@ghershko/releaseradar` before the rename, so merging this revert to `main`
should publish `@ghershko/releaseradar@1.0.18` automatically.

If CI fails on auth, confirm the Trusted Publisher on npmjs.com points to:
- package `@ghershko/releaseradar`, repo `ghershko3/releaseradar`, workflow `publish.yml`

## Off-repo growth (name-independent)

These all point at the GitHub repo, which is unchanged.

- **GitHub repo topics** — done (`cli`, `github-releases`, `devtools`, `release-notes`, `nodejs`).
- **Pin the repo** on your GitHub profile (Profile → Customize → Pinned repositories).
- **awesome-cli-apps PR** — submitted: https://github.com/agarrharr/awesome-cli-apps/pull/1118
- **awesome-nodejs** — blocked (repo restricts PRs to prior contributors). Open an issue or contribute elsewhere first.

## Demo section

README uses static terminal output. Optional upgrade with asciinema:

```bash
brew install asciinema
asciinema rec demo.cast
# run: rr list --last 7d, rr releases v2.1.0 v2.1.5, rr list api --last 24h
asciinema upload demo.cast
```

## Launch post draft (dev.to / Show HN)

**Title:** What shipped since Friday? Query GitHub releases from your terminal

**Hook:** On-call engineers and release managers waste time clicking through GitHub's release UI. `rr` gives you version diffs, monorepo filtering, and time windows in one command.

**Body outline:**

1. **The problem** — "What's deployed in prod vs what's in the latest release?" requires multiple GitHub clicks or scripting `gh release list`.
2. **The solution** — `npm i -g @ghershko/releaseradar`, set `RR_ORG`/`RR_REPO`, run `rr`.
3. **Demo commands:**
   ```bash
   rr list --last 7d                    # what shipped this week
   rr releases v2.1.0 v2.1.5            # diff between two versions
   rr list api --last 24h               # monorepo: api service only
   rr search "CVE"                      # find security-related releases
   ```
4. **Differentiators** — version-range diffing, monorepo prefix filter, `--last` time windows.
5. **Requirements** — uses GitHub CLI (`gh`) you probably already have.
6. **Links** — npm: https://www.npmjs.com/package/@ghershko/releaseradar, GitHub: https://github.com/ghershko3/releaseradar

**Show HN submission title:** Show HN: releaseradar – compare and diff GitHub releases from the terminal

**Tags (dev.to):** `cli`, `github`, `devtools`, `opensource`, `node`

## Ongoing discovery

- Answer Stack Overflow / Reddit questions about comparing GitHub releases with a genuine answer + tool mention.
- Search GitHub Issues in related repos (`release-please`, `semantic-release`) for pain points releaseradar solves.
- Add a "Used by" section to README once you have adopters.
