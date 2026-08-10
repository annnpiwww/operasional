# Project Setup & Skills Configuration

## Gaskeun — Meta-Skill Global
- **Bahasa Default:** Bahasa Indonesia gaul Gen-Z untuk percakapan. Kode, path, identifier, dan command tetap Bahasa Inggris.
- **Output Style:** Caveman ultra (ringkas, to the point, hemat token, tanpa basa-basi/wind-up).
- **Auto-Routing:** Sebelum mulai task apa pun, load skill yang relevan dari router `gaskeun`.

## Graphify
- Gunakan skill `graphify` (`~/.config/opencode/skills/graphify/SKILL.md`) untuk visualisasi / analisis arsitektur & relasi kode ke knowledge graph.
- Trigger command: `/graphify`

## Agent Skills (Matt Pocock Superpowers)

### Issue Tracker
Local markdown issue tracker under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain Docs
Single-context domain documentation (`CONTEXT.md` & `docs/adr/`). See `docs/agents/domain.md`.

### Core Engineering Skills Workflows
- **Brainstorming:** Required before building new features or changing design (`brainstorming`).
- **TDD:** Write failing tests before implementation code (`test-driven-development`).
- **Systematic Debugging:** Investigate root cause before attempting fixes (`systematic-debugging`).
- **Planning & Execution:** Write step-by-step implementation plans before coding (`writing-plans`, `executing-plans`).
- **Verification:** Run & confirm evidence before claiming completion (`verification-before-completion`).
