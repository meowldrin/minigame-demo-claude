# CLAUDE.md

## Project Overview
This project is a small turn-based roguelike prototype built incrementally.
The aim is to create a simple playable game, not a full-scale production.

## Main Gameplay Loop
The player enters a dungeon floor, explores rooms, fights enemies, collects useful items, and reaches the exit to advance to the next floor.

## Mandatory Features
The project should gradually implement:
- tile-based map
- procedural dungeon generation
- player movement
- turn system
- enemy turns
- collision handling
- melee combat
- health system
- death condition
- stairs to next level
- fog of war

## Nice-to-Have Features
Only add these when explicitly requested:
- inventory
- ranged attacks
- equipment
- special enemy behaviors
- loot rarity
- status effects
- save/load
- sound
- animations

## Hard Constraints
- Keep the project lightweight
- Keep the code beginner-friendly
- Prefer clarity over cleverness
- Do not add libraries unless necessary
- Do not replace the architecture without explicit approval
- Do not implement multiple systems at once if one is enough

## Preferred Workflow
For each request:
- first understand the current structure
- propose a short implementation plan
- change as little code as possible
- implement one feature at a time
- keep the project runnable after each step

## File Organization
Preferred structure:
- `index.html`
- `style.css`
- `src/main.js`
- `src/gameState.js`
- `src/mapGenerator.js`
- `src/render.js`
- `src/player.js`
- `src/enemy.js`
- `src/combat.js`
- `src/fogOfWar.js`

This structure can evolve, but only if it remains simple.

## Design Philosophy
This game should feel:
- readable
- modular
- easy to extend
- fast to test

## Avoid
Avoid:
- premature optimization
- unnecessary OOP complexity
- giant classes
- magic numbers without explanation
- deep inheritance hierarchies
- large refactors during small tasks

## If Unsure
If requirements are ambiguous:
- choose the simplest implementation
- preserve the current gameplay loop
- ask for confirmation only when the ambiguity is substantial




# Project Workflow

This project uses:
- GitHub for source code and pull requests
- Jira for backlog, sprint planning, and task tracking

Jira is the source of truth for work status.
Code must follow the active Jira ticket.

## Jira Rules

- Every implementation task must start from a Jira issue.
- Do not work on undocumented features unless explicitly asked.
- Before coding, read the Jira issue summary, description, comments, and acceptance criteria.
- If the Jira issue is unclear, propose a clarification in the issue comments before implementing.
- Treat acceptance criteria as the minimum definition of done.
- When work starts, move the Jira issue to `In Progress` if tools allow it.
- When implementation is complete, add a short progress note to the Jira issue.
- When opening a PR, reference the Jira key in the PR title and branch name.
- When work is ready for review, move the issue to `Review` if that status exists.
- When review and testing pass, move the issue to `Done`.

## Naming Convention

- Branch names must include the Jira key.
  Example: `feature/ROGUE-12-player-movement`
- Commit messages should start with the Jira key.
  Example: `ROGUE-12 implement player movement on grid`
- PR titles should start with the Jira key.
  Example: `ROGUE-12: implement player movement on grid`

## Backlog Rules

- Prefer small Jira issues.
- A Jira task should represent one clear, testable change.
- If a task feels too large, split it before implementation.
- Avoid mixing gameplay logic, rendering changes, and refactors in the same issue unless necessary.

## Agent Responsibilities

### product-manager
- Maintains the Jira backlog
- Splits features into small issues
- Writes clear acceptance criteria
- Keeps sprint scope realistic

### game-developer
- Implements gameplay features from Jira issues
- Makes the smallest useful change first
- Reports implementation notes back to Jira

### javascript-pro / typescript-pro
- Preserves code clarity and modularity
- Supports implementation details and code quality
- Avoids unnecessary abstractions

### code-reviewer
- Checks that the PR matches the Jira issue
- Verifies acceptance criteria are satisfied
- Flags regressions, overengineering, or scope drift

### qa-expert
- Derives manual test cases from Jira acceptance criteria
- Confirms the feature is actually playable and stable

## Definition of Done

A Jira issue is done only when:
- the requested behavior works
- acceptance criteria are satisfied
- the game still runs
- the change is linked to a PR or commit
- the Jira issue contains a short implementation note

## Anti-Drift Rules

- Do not invent new Jira issues unless explicitly asked to help with backlog creation.
- Do not expand the scope of the current Jira ticket.
- Do not silently refactor unrelated files.
- Do not mark an issue as done if only partial work is complete.
- If implementation reveals missing requirements, comment on the Jira issue and stop scope expansion.