# Source Code Architecture

Clean, modular organization following separation of concerns principles.

## Directory Structure

```
src/
├── utils/           # Utility functions (reusable across layers)
│   ├── constants.js     # Application-wide constants
│   ├── string-utils.js  # String manipulation utilities
│   ├── date-utils.js    # Date formatting and operations
│   ├── validation.js    # Input validation and error classes
│   └── shell-utils.js   # Shell command execution wrapper
│
├── api/             # External API communication
│   └── github.js        # GitHub CLI wrapper
│
├── services/        # Business logic layer
│   └── releases.js      # Release data processing
│
├── presentation/    # Display formatting layer
│   ├── formatter.js     # Console output formatting
│   └── table.js         # Table rendering utilities
│
└── commands/        # CLI command orchestration
    └── index.js         # Command handlers
```

## Layer Responsibilities

### `utils/` - Utility Functions

**Purpose**: Reusable, pure functions used across all layers

**Modules**:

- **`constants.js`** - Application constants (limits, patterns, widths)
- **`string-utils.js`** - String operations (prefix extraction, text cleaning)
- **`date-utils.js`** - Date formatting and comparisons
- **`validation.js`** - Input validation, config validation, custom error classes
- **`shell-utils.js`** - Safe shell command execution

**Characteristics**:

- Pure functions (no side effects)
- Highly testable
- Zero external dependencies within utils

### `api/` - External Communication

**Purpose**: Isolates all external API calls

**Responsibilities**:

- Wraps GitHub CLI (`gh`) commands
- Handles authentication checks
- Manages pagination for large datasets
- Error handling for API failures

**Key Functions**:

- `checkGitHubCli()` - Verifies CLI installation and auth
- `fetchReleasesFromGitHub()` - Fetches paginated releases

### `services/` - Business Logic

**Purpose**: Core data processing and transformation

**Responsibilities**:

- Transform raw GitHub data to internal format
- Extract real authors from CI/CD bot releases
- Sort and filter release data
- Version prefix extraction

**Key Functions**:

- `fetchAndProcessReleases()` - Main orchestration
- `extractRealAuthorFromReleaseNotes()` - Parse release notes for real author
- `transformReleaseData()` - Convert GitHub format to internal format

**Data Flow**:

```
Raw GitHub JSON → Transform → Validate → Sort → Internal Format
```

### `presentation/` - Display Formatting

**Purpose**: Handles all console output formatting

**Responsibilities**:

- Format release data for display
- Create table layouts
- Handle detailed vs. compact views
- Text truncation and padding

**Key Functions**:

- `formatRelease()` - Main formatting dispatcher
- `formatReleaseDetailed()` - Detailed single release view
- `formatReleaseCompact()` - Table row formatting
- `createReleasesTableHeader()` - Table header creation

**Separation**: Knows how to display, not what to fetch or process

### `commands/` - CLI Orchestration

**Purpose**: Coordinates between services and presentation

**Responsibilities**:

- Handle command routing
- Validate command parameters
- Coordinate data fetching (services) and display (presentation)
- Implement command-specific logic

**Key Functions**:

- `commandReleases()` - Show releases since version
- `commandInfo()` - Show detailed release info
- `commandSearch()` - Search across releases
- `commandList()` - List releases with filtering
- `showHelp()` - Display help text

**Pattern**: Each command follows:

1. Validate input
2. Fetch/process data (via services)
3. Format output (via presentation)

## Design Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility:

- **Utils** = reusable tools
- **API** = external communication
- **Services** = business logic
- **Presentation** = formatting
- **Commands** = orchestration

### 2. Dependency Direction

```
Commands → Services → API
Commands → Presentation
All layers → Utils
```

No circular dependencies. Lower layers never depend on higher layers.

### 3. Pure Functions Where Possible

Most functions in `utils/` and parts of `services/` are pure:

- Same input = same output
- No side effects
- Easy to test

### 4. Error Handling

Custom error classes in `utils/validation.js`:

- `RrError` - Base error class
- `ValidationError` - Input/config validation errors
- `GitHubApiError` - API communication errors

Errors bubble up to `index.js` for centralized handling.

### 5. Modern JavaScript Patterns

- Destructuring for cleaner code
- Optional chaining (`?.`) for safe property access
- Nullish coalescing (`??`) for default values
- Arrow functions for concise syntax
- ES6 modules for clear imports/exports

## Data Models

### Release Object (Internal Format)

```javascript
{
  tag: string,           // e.g., "app-25.12.107"
  name: string,          // Release name
  repo: string,          // Repository name
  published: string,     // ISO date string
  author: string,        // Real author (not bot)
  releaseNotes: string,  // Full release notes
  url: string,           // GitHub release URL
  commitSha: string      // Commit SHA
}
```

### Config Object

```javascript
{
  org: string,              // GitHub organization
  repo: string,             // Repository name
  releaseLimit: number      // Max releases to fetch (default: 300)
}
```

## Testing Strategy

Tests are organized by functionality:

- **`formatting.test.js`** - String/date utilities
- **`github.test.js`** - Author extraction logic
- **`run-all.js`** - Test runner

### Test Coverage

- ✅ Prefix extraction with edge cases
- ✅ Date formatting
- ✅ Change text extraction and cleaning
- ✅ Real author detection patterns
- ✅ Null/empty input handling

## Adding New Features

### Adding a New Utility

1. Add to appropriate file in `utils/` or create new util file
2. Export function
3. Add tests
4. Document in this README

### Adding a New Command

1. Add handler to `commands/index.js`
2. Register in `COMMAND_HANDLERS` in `index.js`
3. Add to help text in `showHelp()`
4. Update main README

### Adding a New Data Source

1. Create new file in `api/` (e.g., `gitlab.js`)
2. Implement same interface as `github.js`
3. Update services to handle new format
4. Add configuration options

## Code Style Guidelines

- Use `const` by default, `let` when needed
- Prefer arrow functions for callbacks
- Use descriptive variable names (e.g., `releaseNotes` not `body`)
- Extract magic numbers/strings to constants
- Keep functions small (< 30 lines ideally)
- One responsibility per function
- Document complex logic with clear comments (when needed)

## Performance Considerations

- Releases are fetched once per command invocation
- Sorting/filtering happen in memory (fast for < 1000 releases)
- Table formatting is optimized for console output
- Pagination prevents fetching unnecessary data

## Future Enhancements

Potential improvements:

- Caching releases to disk for faster subsequent runs
- Compare two versions side-by-side
- Export to JSON/CSV formats
- Interactive mode with prompts
- Multiple repository support in single command
- Release notes templates validation
- Custom output formatters (JSON, Markdown)

---

**Architecture Goal**: Simple, maintainable, and extensible code that's easy to understand and modify.
