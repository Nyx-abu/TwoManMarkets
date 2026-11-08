# TwoManMarkets Workspace Preview

Static shell for the internal prediction-market research and team operations dashboard. Fictional sample data only; no backend or trading functionality.

## Run

```powershell
npm ci
npm run dev
```

## Verify and build

```powershell
npm run typecheck
npm run build
```

Static output is `dist/`; it contains the UI and bundled brand asset. Do not serve the project root as a public file directory.

## Documentation

- [Preview scope](docs/PREVIEW_SCOPE.md)
- [High-Level Design](docs/HIGH_LEVEL_DESIGN.md)
- [Low-Level Design](docs/LOW_LEVEL_DESIGN.md)
- [Confluence handoff](docs/CONFLUENCE_IMPORT.md)
- [Production architecture decision](docs/adr/001-production-modular-monolith.md)
- [Internal master specification](PROJECT_MASTER_SPEC.md) — retained locally and excluded from source publication.

The future production design is proposed; the current application provides inspectable screens only.

## Diagram sources

```powershell
node scripts/export-architecture-diagrams.mjs
```

Exports seven editable Mermaid sources under `docs/diagrams/`. Use the native Confluence Mermaid macro with default lavender styling and verify rendering in myspace before sharing.
