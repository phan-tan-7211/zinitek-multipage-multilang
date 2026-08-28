# Repository AI Skills

This directory contains repository-scoped AI skills used when working on ZINITEK.

## Installed project skill

```text
.agents/skills/zinitek-project/SKILL.md
```

This skill contains ZINITEK-specific architecture and safety rules.

## Recommended external skill layout

Keep third-party skills separate instead of merging them into `AGENTS.md` or the project skill.

```text
.agents/skills/
├─ zinitek-project/
│  └─ SKILL.md
├─ ui-ux-pro-max/
│  └─ SKILL.md
├─ last30days/
│  └─ SKILL.md
├─ superpowers/
│  └─ ...
└─ anthropic/
   ├─ frontend-design/
   │  └─ SKILL.md
   ├─ webapp-testing/
   │  └─ SKILL.md
   └─ ...
```

## External sources

Planned sources:

- `nextlevelbuilder/ui-ux-pro-max-skill`
- `mvanhorn/last30days-skill`
- `obra/superpowers`
- selected skills from `anthropics/skills`

Do not copy an entire external repository blindly. Install/copy only the skill directories and support files actually required by the chosen skill, preserving its original folder structure and license requirements.

## Routing

The root `AGENTS.md` defines when each skill should be used and which project rules take priority.

General rule:

```text
AGENTS.md
   ↓
zinitek-project (project constraints)
   ↓
relevant specialist external skill(s)
   ↓
implementation + verification
```

The existing root `SKILL.md` is intentionally retained as documentation of ZINITEK interaction patterns already implemented in the codebase. It is not replaced by third-party skills.
