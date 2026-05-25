# AGENTS.md

## Purpose

This repository contains the customer-facing frontend for Notarix.

All contributors must operate with the mindset of a senior frontend engineer, prioritizing:

- usability
- accessibility
- responsiveness
- consistency
- maintainability
- performance
- release safety

The standard is polished, production-ready frontend delivery.

---

## Git Workflow

### Branching Rules

- `main` must remain stable and demo-ready
- Never build directly on `main`
- Start each feature, page, UI module, or bug fix from the latest `main`
- Use one branch per focused frontend task

### Branch Naming

Use clear names:

- `feature/frontend-landing-hero`
- `feature/frontend-client-orders`
- `fix/frontend-mobile-nav`
- `refactor/frontend-dashboard-layout`
- `chore/frontend-copy-update`

### Start-of-Work Flow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-your-feature
```

### Commit Rules

- Commit after a usable UI slice or full feature checkpoint is complete
- Keep visual, state, and routing changes scoped to the same feature only when they belong together
- Avoid unrelated cleanup in the same commit
- Run relevant linting/build checks before committing
- Use readable conventional commits

Preferred commit messages:

- `feat(frontend): add trust page call-to-action section`
- `fix(frontend): correct mobile sidebar overflow`
- `refactor(frontend): split dashboard order cards into reusable components`
- `style(frontend): improve landing page spacing and typography`
- `test(frontend): add coverage for request access form`

### Push Rules

- Push the branch when the page, module, or feature is in a stable reviewable state
- Avoid pushing unfinished UI that cannot be reviewed meaningfully unless marked as draft/WIP

```bash
git push -u origin feature/frontend-your-feature
```

### Pull Request Rules

Open a pull request after a complete feature, module, or reviewable user-facing slice is finished.

Every PR should include:

- summary of UI/UX changes
- affected routes, components, and states
- screenshots or screen recordings when applicable
- responsive considerations
- testing or lint/build checks performed

### Merge Rules

- Update from `main` before merge
- Resolve conflicts carefully, especially in shared layout, styles, and component files
- Merge only after the implementation is coherent, reviewed, and visually checked

Preferred sync flow:

```bash
git checkout main
git pull origin main
git checkout feature/frontend-your-feature
git merge main
```

### Completion Standard

A frontend feature is considered complete only when:

- implementation is finished
- responsive behavior is checked
- lint/build validation is done
- relevant docs are updated if needed
- branch is pushed
- PR is prepared
- merge happens after review readiness

### Agent Behavior Requirement

When working in this repository, the coding agent must:

- group work by visible feature or module
- avoid direct commits to `main`
- use clear feature branches
- keep commits understandable to non-authors reviewing UI work
- push only stable checkpoints
- prepare frontend work so it is easy to review visually and functionally

---

## Frontend Engineering Standards

- Preserve routing clarity and component boundaries
- Prefer reusable components over duplicated UI
- Maintain accessibility basics such as semantic structure, labels, focus states, and keyboard safety
- Keep layouts responsive across desktop and mobile
- Avoid visual regressions in shared components without checking downstream screens
