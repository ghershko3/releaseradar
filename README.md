# releaseradar 🚀

> Stop clicking through GitHub releases. Search, filter, and compare them from your terminal.

Ever needed to answer "What changed between version X and Y?" or "Who actually made this release?" Now you can—from your terminal, in seconds.

## Why releaseradar?

**The Problem:** GitHub's web UI is great for browsing, but terrible for:

- Finding what changed since a specific version
- Searching across all your releases
- Seeing who _actually_ made changes (vs. CI bot names)
- Working with multi-service monorepos

**The Solution:** A blazingly fast CLI that treats your releases like queryable data.

```bash
$ rr releases app-25.12.100

Releases since app-25.12.100 (prefix: app-):

TAG                 DATE             AUTHOR      CHANGES
────────────────────────────────────────────────────────────────────
app-25.12.107       2025-12-18 14:13  johndoe    SP-62488 - fix upload
app-25.12.106       2025-12-18 13:42  janedoe    SP-63252 Remove dot
app-25.12.105       2025-12-18 13:10  bobsmith   [SP-62629]: add spans

Total: 7 release(s)
```

## Get Started in 60 Seconds ⚡

### 1. Install

```bash
npm i -g @ghershko/releaseradar
```

### 2. Setup GitHub CLI (if needed)

```bash
brew install gh        # macOS
gh auth login         # authenticate once
```

### 3. Run your first command

**Option A: Quick start with flags**

```bash
rr --org myorg --repo myrepo list
```

**Option B: Save defaults (one-time setup)**

```bash
rr init              # saves your default org/repo
rr list              # now just works!
```

That's it! You're ready to query releases.

## What You Can Do

### 📊 Compare Versions

See everything that changed since a specific release:

```bash
rr releases v2.1.0
```

### 🔍 Search Releases

Find releases mentioning specific features or bugs:

```bash
rr search "authentication fix"
```

### 📋 List & Filter

View all releases, optionally filtered by service prefix:

```bash
rr list              # all releases
rr list api          # only api-* releases
```

### 📝 Get Details

Full info about any release:

```bash
rr info v2.1.5
```

## Power Features

### 🎯 Multi-Service Monorepo Support

Works great with tagged services (`app-`, `api-`, `worker-`):

```bash
rr list api          # only API releases
rr releases api-1.0.0  # API changes since 1.0.0
```

### 👤 Real Author Detection

Automatically finds the actual developer behind CI/CD releases:

```bash
Release created by github-actions-bot
↓
Author: johndoe       # extracted from commit/PR
```

### 🔄 Multi-Repo Friendly

Switch between repos instantly with flags:

```bash
rr --org myorg --repo backend releases v1.0
rr --org myorg --repo frontend list
```

## Command Reference

| Command             | Description             | Example               |
| ------------------- | ----------------------- | --------------------- |
| `rr releases <tag>` | Show releases since tag | `rr releases v1.0.0`  |
| `rr info <tag>`     | Get release details     | `rr info v2.1.5`      |
| `rr search <term>`  | Search all releases     | `rr search "bug fix"` |
| `rr list [prefix]`  | List releases           | `rr list api`         |
| `rr init`           | Save default config     | `rr init`             |

### Flags

- `--org <name>` - Override GitHub organization
- `--repo <name>` - Override repository name
- `--limit <num>` - Max releases to fetch (default: 300)
- `--changes` - Show what changed in list view

## Real-World Examples

### Scenario 1: "What's new since production?"

```bash
$ rr releases api-2.1.0

TAG                 DATE             AUTHOR      CHANGES
────────────────────────────────────────────────────────────────────
api-2.1.5           2025-12-20 09:23  alice      Rate limiting fix
api-2.1.4           2025-12-19 16:42  bob        Auth token refresh
api-2.1.3           2025-12-19 14:15  charlie    DB connection pool
api-2.1.2           2025-12-18 11:30  alice      Logging improvements
api-2.1.1           2025-12-18 09:00  bob        Cache invalidation

Total: 5 release(s)
```

### Scenario 2: "Find that security patch"

```bash
$ rr search "CVE"

TAG                 DATE             AUTHOR      CHANGES
────────────────────────────────────────────────────────────────────
app-2.3.1           2025-11-15 13:22  security   CVE-2024-1234 patch
api-2.0.8           2025-10-03 10:15  security   CVE-2024-5678 fix

Total: 2 match(es)
```

### Scenario 3: "Full release details"

```bash
$ rr info api-2.1.5

────────────────────────────────────────────────────────
Tag:       api-2.1.5
Published: 2025-12-20 09:23:15
Author:    alice
URL:       github.com/myorg/myrepo/releases/tag/api-2.1.5

Release Notes:
## What's Changed
* Fix rate limiting edge case causing 429 errors
* Update dependencies to latest security patches
* Add retry logic for transient failures

**Full Changelog**: v2.1.4...v2.1.5
────────────────────────────────────────────────────────
```

## Configuration

Two ways to configure gvm:

### Option 1: Save Defaults (Recommended for single repo)

```bash
$ rr init
? Organization: myorg
? Repository: myrepo
? Release limit (default 300): 300

✓ Config saved to ~/.releaseradar/config.json
```

Now all commands work without flags:

```bash
rr list
rr releases v1.0.0
```

### Option 2: Use Flags (Great for multiple repos)

No setup needed, just add flags:

```bash
rr --org company --repo backend list
rr --org company --repo frontend releases v2.0
```

Mix and match:

```bash
rr list                              # uses saved config
rr --org other --repo other list     # overrides for this command
```

## Under the Hood

- **Lightning Fast**: Uses GitHub CLI (`gh`) for authenticated API access
- **Smart Parsing**: Automatically extracts service prefixes and groups releases
- **Author Intelligence**: Digs through commits to find real authors (not just bot names)
- **Zero Config**: Works out of the box with flags, or save defaults for convenience

## Use Cases

✅ **Release Management** - Compare versions before deployment  
✅ **Change Tracking** - See what's in the current sprint  
✅ **Security Audits** - Search for CVE fixes across all releases  
✅ **Monorepo Teams** - Filter by service/component prefix  
✅ **DevOps** - Integrate into CI/CD pipelines  
✅ **Documentation** - Generate changelogs automatically

## Contributing

Built something cool with releaseradar? Found a bug? PRs welcome!

```bash
git clone https://github.com/ghershko3/releaseradar.git
cd releaseradar
npm install
node tests/run-all.js  # run tests
```

## Troubleshooting

**Command not found: rr**

```bash
npm i -g @ghershko/releaseradar
```

**GitHub CLI not installed**

```bash
brew install gh
gh auth login
```

**No releases showing up**

- Check your org/repo names: `rr --org myorg --repo myrepo list`
- Increase limit: `rr --limit 500 list`

## License

MIT - Use it anywhere, modify it however you want.

---

**Made with ❤️ for developers tired of clicking through GitHub's UI**

[Report Bug](https://github.com/ghershko3/releaseradar/issues) · [Request Feature](https://github.com/ghershko3/releaseradar/issues) · [Documentation](https://github.com/ghershko3/releaseradar)
