# Contributing

## Setup

Node version: see [`.nvmrc`](./.nvmrc) (`nvm use`).

```sh
npm install
npm start          # demo on http://localhost:4242, rebuilt on change
```

## Before opening a PR

CI runs these on every PR ([`check-repo.yml`](./.github/workflows/check-repo.yml)):

```sh
npm run build
npm test -- --run  # vitest (watch mode without --run)
npm run lint       # npm run lint:fix to fix
npm run pretty     # npm run pretty:fix to fix
```

## Commits and branches

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `type(scope): subject`, scope optional, `!` after the type for a breaking change ([theme-0014](./docs/adr/theme-0014-commit-and-branch-convention.md)).

- Types in use: `feat`, `fix`, `core`, `build`, `chore`, `docs`.
- Scopes in use: `cli`, `migrate`, `adr`…
- Branches: `type/slug`, e.g. `feat/105-select-slides`, `fix/…`, `core/…`, `chore/…`, `docs/…`.

Example: `feat(cli): warn on unknown config keys`.

## Proposing a decision (ADR)

Any decision that affects the template or the schools gets an ADR ([theme-0000](./docs/adr/theme-0000-adopt-adrs.md)):

1. Create `docs/adr/theme-NNNN-kebab-slug.md`, `NNNN` being the next free number. Follow the sections of an existing ADR (edgex template).
2. Add a `[pending](<PR URL>) <date>` line to its Change Log, and link related ADRs as `[[theme-NNNN-slug]]`.
3. Open a PR. To change an existing decision, edit its file in place and add a Change Log line; never create a new file for it.

## Adding tooling

The default answer is no ([theme-0016](./docs/adr/theme-0016-minimal-tooling-footprint.md)). A PR adding a dependency or a tool to the theme, the template, the CLI or the project root says what it costs a trainer or a participant to install and maintain, and why that is worth it. The deck itself stays zero-install ([theme-0004](./docs/adr/theme-0004-self-contained-slides.md)).

## Releasing

Semantic Versioning, and one annotated git tag per published version ([theme-0013](./docs/adr/theme-0013-semver-and-git-tags.md)). Prereleases use `-rc.N`, starting with the next version line: the first one is `5.0.0-rc.0`. Never mix the two formats within one version: `4.0.0` keeps `-rc-N` (semver ranks `4.0.0-rc.17` below `4.0.0-rc-16`). Already published `-rc-N` versions keep their names.

1. In a PR: bump `version` in `package.json` (`npm version <version> --no-git-tag-version`) and move the `[Unreleased]` entries of [`CHANGELOG.md`](./CHANGELOG.md) under the new version.
2. Once merged, on that exact commit: `npm run build && npm publish`.
3. Tag the published commit and push the tag:

    ```sh
    git tag -a v5.0.0-rc.0 -m "v5.0.0-rc.0"
    git push origin v5.0.0-rc.0
    ```

A breaking change to the CLI contract or the project layout is a major bump.

## Troubleshooting

"System limit for number of file watchers reached": see [this answer](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/17437601#17437601).
