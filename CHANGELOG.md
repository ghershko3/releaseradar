# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.17] - 2026-06-02

### Changed
- Renamed package from `@ghershko/releaseradar` to unscoped `releaseradar` for npm discoverability
- README badges, demo section, and npm metadata optimized for organic discovery

## [1.0.16] - 2025-12-XX

### Added
- `--last` time-window filter support on the `releases` command

## [1.0.15] - 2025-12-XX

### Added
- `--last` flag to filter releases by time window (e.g. `24h`, `7d`)
- Version range comparison: `rr releases <from> [to]`

### Changed
- README installation instructions for Yarn

## [1.0.14] - 2025-12-XX

### Fixed
- Publish workflow version bump to trigger CI correctly

## [1.0.13] - 2025-12-XX

### Changed
- Publish workflow version bump logic and npm version scripts

## [1.0.12] - 2025-12-XX

### Changed
- CI auto-bump version when already published
- Node 24 default in publish workflow

## [1.0.11] - 2025-12-XX

### Changed
- Removed provenance flag for private repository compatibility

## [1.0.10] - 2025-12-XX

### Changed
- Updated npm CLI for Trusted Publishing support

## [1.0.9] - 2025-12-XX

### Changed
- Initial npm publish workflow improvements

## [1.0.0] - 2025-XX-XX

### Added
- Initial release: `list`, `releases`, `search`, and `info` commands
- Monorepo prefix filtering
- Real author detection (not CI bots)
- Environment variable and flag-based configuration (`RR_ORG`, `RR_REPO`)

[1.0.16]: https://github.com/ghershko3/releaseradar/compare/v1.0.15...v1.0.16
[1.0.15]: https://github.com/ghershko3/releaseradar/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/ghershko3/releaseradar/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/ghershko3/releaseradar/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/ghershko3/releaseradar/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/ghershko3/releaseradar/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/ghershko3/releaseradar/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/ghershko3/releaseradar/compare/v1.0.8...v1.0.9
[1.0.0]: https://github.com/ghershko3/releaseradar/releases/tag/v1.0.0
