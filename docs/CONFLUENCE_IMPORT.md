# Confluence handoff — TwoManMarkets

**Prepared:** 8 November 2026  
**Target space display name:** myspace  
**Publication status:** Files prepared locally; Confluence pages have not been created.

## Suggested page tree

```text
myspace
└── TwoManMarkets Architecture
    ├── High-Level Design — TMM-HLD-001
    ├── Low-Level Design — TMM-LLD-001
    └── Architecture Decisions
        └── ADR-001 — Production modular monolith
```

Use `HIGH_LEVEL_DESIGN.md`, `LOW_LEVEL_DESIGN.md` and `adr/001-production-modular-monolith.md` as the source documents. The files contain no client payment terms, private contact handles or credentials. Review the proposed assumptions with the client before marking the documents Accepted.

## Import and diagrams

Confirm the intended Confluence site, actual space key and page parent before publishing; a display name alone does not identify a unique space. Use the workspace's supported Markdown import or paste process and check the resulting headings, code blocks, links and diagrams. No specific import feature or Mermaid app has been verified in this workspace.

Mermaid sources are fenced in the Markdown. The supplied Zovu convention uses the native Narva Software Mermaid Diagram macro, editable source and default lavender styling. Verify that macro is available in myspace and insert each diagram's source. Do not substitute a static image when editable Mermaid is required. Avoid public rendering services for confidential architecture.

To extract the seven diagram sources without additional dependencies, run from the project folder:

```powershell
node scripts/export-architecture-diagrams.mjs
```

Outputs are `docs/diagrams/H1.mmd` through `H3.mmd` and `L1.mmd` through `L4.mmd`. Extraction does not render or validate Mermaid syntax. Figure IDs correspond to the captions in the HLD/LLD.

The documents were revised after reading the supplied `Documentation_Review_Rules.md`, `Notification_Hub_LLD.md` and `High_Level_Design_Loyalty_Module.md`. They reuse concise sections, compact contracts, numbered procedures and small flowcharts; they do not reuse those modules' architectural decisions.

Convert procedure blocks to native grey Code snippets, identifiers to inline Code, and contract tables to native Confluence tables. Pasted Markdown markers alone do not establish native formatting. Verify the actual macro's lavender rendering before saving; local extraction does not verify Confluence rendering.

## Review before sharing

- Keep the Proposed status and the distinction between the current static preview and future backend design.
- Verify the correct myspace destination and client viewing permissions.
- Check diagrams render and references point to the created Confluence pages rather than local relative filenames.
- Check no internal master specification or commercial terms were imported alongside these documents.
- Share the reviewed Confluence page links; creating these local files does not publish them.
