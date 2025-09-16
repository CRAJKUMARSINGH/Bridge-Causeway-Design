General AI Agent Prompt for Bug Removal, Optimization, and Readiness

Objective
Create a standardized, platform-agnostic checklist and instructions to analyze an application, identify and fix bugs, optimize performance, streamline build/deployment, and improve usability and maintainability.

Tasks
1. Bug Detection and Functional Verification
- Analyze Codebase: Review source for errors, dead code, anti-patterns, and security issues.
- Test Features: Verify core user flows, inputs/outputs, and edge cases.
- Reproduce and Triage: Document repro steps, expected vs actual behavior, severity, and scope.
- Fix and Validate: Implement fixes with clear edits and verify against acceptance criteria.

2. Build and Deployment Optimization (choose those that apply)
- Web (SPA/SSR): Ensure correct build scripts, environment variables, routing, and asset handling.
- Node/Express APIs: Validate production configs, logging, error handling, and graceful shutdowns.
- Python apps: Pin dependencies, optimize startup, and ensure Streamlit/FastAPI configs when used.
- Static hosting (Vercel/Netlify/GitHub Pages): Confirm framework adapters, redirects, and cache headers.
- Containers: Provide Dockerfile and minimal image, healthchecks, and compose file if relevant.

3. Performance and Efficiency
- Frontend: Reduce bundle size, code-split, lazy-load heavy routes, optimize images/assets.
- Backend: Remove N+1s, add caching where sensible, optimize hot paths, set proper timeouts.
- Data: Use pagination/virtualization for large lists; prefer streaming where possible.
- Error Handling: Centralize handlers and return actionable errors without leaking sensitive data.

4. UX, Accessibility, and Reliability
- UX: Simplify flows, add loading/empty/error states, confirm responsiveness.
- Accessibility: Basic a11y pass (landmarks, alt text, labels, contrast, keyboard navigation).
- Observability: Add structured logs and minimal metrics where supported.

5. Documentation and Developer Experience
- HOW_TO_RUN.md: Clear local setup, environment variables, seed data, and start commands.
- HOW_TO_DEPLOY.md: Environment-specific deployment steps and rollback guidance.
- CHANGELOG.md (optional): Summarize important changes.
- Helper Scripts: Provide Windows .bat and Unix .sh one-liners for install, run, and build.

6. Feature Suggestions (optional)
- Efficiency: Caching, background jobs, async I/O where applicable.
- UX: Small wins that reduce friction; avoid scope creep.

Deliverables
- Bug Report: List of issues with severity, repro steps, root cause, and fixes.
- Code Edits: Provide diffs or full files for all changes.
- Optimized Configs: Updated build scripts, environment samples, and deployment configs.
- Documentation: Updated HOW_TO_RUN.md and (if needed) HOW_TO_DEPLOY.md.
- Helper Scripts: Cross-platform scripts (e.g., INSTALL_DEPS.bat / START_APP.bat and install.sh / start.sh).
- Cleanup List: Removed/archived redundant files with justification.

Constraints
- Maintain functional parity unless a change is explicitly approved.
- Prefer minimal, well-supported, open-source dependencies.
- Ensure security best practices and avoid leaking secrets.
- Keep solutions lightweight and maintainable.

Output Format
- Provide code edits as unified diffs or full-file replacements.
- Include a concise markdown report summarizing: bugs fixed, optimizations, and remaining risks.
- Provide explicit run and deploy instructions with commands tested end-to-end.

Acceptance Checklist
- [ ] All critical bugs fixed and verified by repro tests.
- [ ] App builds and runs locally with documented commands.
- [ ] Production build/deploy path verified or clearly documented.
- [ ] Performance quick-wins applied (bundle, images, queries, caching where safe).
- [ ] Basic a11y and UX states implemented.
- [ ] Redundant files removed or archived; repository tidy.
- [ ] HOW_TO_RUN.md updated; helper scripts added for Windows and Unix.

Notes and Guidance
- Keep changes scoped and reversible. Prioritize clarity and safety.
- When uncertain, propose options with trade-offs and recommended choice.
- Prefer configuration over code when possible; document defaults and overrides.


