# Better-Moodle Philosophy

## 1. Purpose of this document

This document explains why Better-Moodle is the way it is, covering the project's values, conduct expectations, code rationale, and a log of key design decisions. Technical setup and workflow instructions remain in [CONTRIBUTING.md][CONTRIBUTING.md]. Feature descriptions and user-facing FAQ remain in [README.md][README.md].

This is a living document. New principles and decisions should first be discussed in GitHub Discussions before being proposed as a pull request against this file. Existing sections should rarely be rewritten outright; instead, they should be extended or clarified over time. See section 8 for the detailed process of proposing changes.

Decision authority over this document rests with the project's core contributors, the same group referred to as `coreAuthors` in the project's build configuration. Core contributors are defined not by maintaining a specific university instance, but by taking on meta-level work such as code reviews, and by holding write access to the repository. At the time of writing, the core contributors are [@jxn-30][@jxn-30] and [@YorikHansen][@YorikHansen]. This group is allowed to grow over time.

## 2. Working Together

Working together on Better-Moodle is grounded in respectful and appreciative conduct. Beyond this, common standards of decent behavior apply, as they would in any collaborative setting.

### 2.1 It's a hobby project

Better-Moodle is developed entirely in contributors' free time. This applies symmetrically: core contributors do not owe contributors or users any particular speed, availability, or level of support, and contributors do not owe core contributors or each other the same. Delays in review, response, or progress on an issue are normal and should not be read as a sign of disinterest.

### 2.2 Discussion culture

Decisions can, may, and should be critically questioned. This applies not only to the code rationale and design decisions documented in sections 4 and 5, but equally to the values and project goals described in sections 2 and 3 themselves. The preferred place to raise such discussions is GitHub Discussions.

## 3. What the Project Strives For

Better-Moodle is guided by a handful of aspirations that shape both what gets built and how the project is run. These aspirations are not strict rules but a shared direction that decisions can be checked against.

### 3.1 User Experience & Developer Experience

Maximizing both user experience for those using the userscript and developer experience for those contributing to it is a stated goal. For contributors who work on the end product rather than the surrounding tooling, developer experience is optimized primarily through the build system, which handles bundling, translations, and compatibility concerns on their behalf.

### 3.2 Motivating participation

The project should be structured so people are motivated to participate in any form. This explicitly includes reporting bugs, suggesting new features and improvements, and contributing code. Issues labeled [`good first issue`](https://github.com/jxn-30/better-moodle/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22) or [`help wanted`](https://github.com/jxn-30/better-moodle/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22help%20wanted%22) are examples of entry points for getting started, though participation is not limited to these.

### 3.3 A playground for learning

Better-Moodle may serve as a playground that allows contributors to gain experience with the technologies involved, such as userscripts, TypeScript, and Moodle internals. The project may be used for learning and experimentation, not only for producing polished, finished output. As stated in section 4.6, code contributed while learning does not need to be perfect, only good enough to build on.

### 3.4 A community project

Better-Moodle is a community project. It lives not only through those who contribute code, but also through contributors who support the project in their own way without necessarily being visible in the codebase, such as by translating content, testing pre-releases, moderating GitHub Discussions, or helping spread the word about the project.

## 4. Code & Architecture Rationale

The following principles guide how Better-Moodle's code and build output are designed. They explain the reasoning behind recurring technical choices and serve as a reference point for evaluating new contributions.

### 4.1 Transparency and readability

The built userscript should offer maximum transparency. It is not minified, and its code is kept readable. Bundling external libraries into the userscript is avoided wherever reasonably possible.

### 4.2 Minimal permissions & network requests

The userscript requests as few Tampermonkey grants as necessary. HTTP requests to external domains are made only when strictly required.

### 4.3 Clear, well-explained code

Code is written clearly and in an understandable manner. Anything that is not immediately clear in its intent or mechanism is explained with a comment. Contributors are encouraged to document their thought process, whether in a comment, a linked issue, or a pull request description. Reviewers are equally encouraged to ask for clarification whenever something is not clear to them, rather than guessing at intent.

### 4.4 Staying current, staying compatible

The codebase tracks the current state of the art in the languages, libraries, and technologies it uses. Compatibility with a reasonable subset of browsers is ensured through polyfills rather than by avoiding modern language features.

### 4.5 Moodle compatibility

Better-Moodle aims for maximum compatibility with the Moodle instances it supports. Where reasonably possible, it relies on libraries already shipped by Moodle rather than reimplementing equivalent functionality.

### 4.6 "Good enough" over perfect

Code contributed to Better-Moodle does not need to be perfect. It is acceptable for code to be written to the best of a contributor's current knowledge, and code may be optimized at any later point in time. Suggestions for improvement during review are welcome and encouraged, provided they are genuine improvements rather than changes reflecting a reviewer's subjective coding style. Functionality and compatibility with this document take precedence over stylistic preference.

## 5. Design Decision Log

Better-Moodle's architecture and technical direction are shaped by a series of concrete decisions, many of which involved weighing real trade-offs. This section documents the context, alternatives considered, and reasoning behind selected decisions. Entries are appended over time rather than rewritten, so that the reasoning behind past decisions remains traceable even as the project evolves.

<!-- template
### 5.x — *Decided/Open*

**Context:** What was the question that lead us to make a decision regarding Better-Moodle design?

**Decision:** What did we decide?

**Alternatives considered:** Did we consider alternatives?

**Rationale:** What is our rationale that justifies our decision?

Source: An Issue, a PR or a discussion, if available
-->

### 5.1 Complete rewrite around `FeatureGroup`, `Feature`, and a build pipeline — _Decided_

**Context:** The original codebase consisted of the entire userscript written directly as a single JavaScript file, processed only by ESLint and Prettier. As features were added, this became difficult to extend and maintain.

**Decision:** The rewrite introduced two changes together: a class-based structure around `FeatureGroup` and `Feature` as the core abstractions, and a proper build pipeline that bundles the source into the final userscript rather than shipping hand-written JavaScript directly.

**Alternatives considered:** None are documented from this period.

**Rationale:** The `FeatureGroup`/`Feature` abstraction allows features to be registered, configured, and toggled independently while sharing common infrastructure for settings and translations. Introducing bundling on top of this allowed for a cleaner source structure and a more optimized userscript output, both of which were not achievable with a single hand-maintained file.

Source: [PR #214](https://github.com/jxn-30/better-moodle/pull/214)

### 5.2 Polyfills shipped as a subresource by default, with an inline option — _Decided_

**Context:** Polyfills for browser compatibility add a substantial amount of code. Bundling them directly into the userscript makes the script harder to inspect and adds bloat that most users' browsers do not need.

**Decision:** Polyfills are shipped as a separate subresource by default, referenced via a `@require` rule pointing at the last release. Inlining polyfills directly into the userscript remains available as an optional build setting.

**Alternatives considered:** Always bundling polyfills inline within the userscript itself.

**Rationale:** A subresource introduces a potential discrepancy, since the `@require`-linked polyfills reflect the last release while the main userscript may be built from a newer commit. This discrepancy was judged acceptable because polyfills primarily matter for end users on a range of browser versions, whereas developers testing commit or pull request builds are more likely to use current browsers, making polyfill staleness less relevant during development. For release builds, integrity of the subresource is ensured via a hash check.

Source: [Issue #714](https://github.com/jxn-30/better-moodle/issues/714)

### 5.3 Leaning on native `jsx-dom` features over additional libraries — _Decided_

**Context:** Parts of the codebase used manual patterns or extra libraries, such as `classnames`, for things the JSX runtime already supported natively.

**Decision:** Where `jsx-dom` already provides a feature, such as the `className` attribute, `style` as an object, `dataset` as an object, or `ref`, the codebase uses that native support instead of manual workarounds or additional dependencies.

**Alternatives considered:** Continuing to rely on manual DOM manipulation or extra libraries for functionality already covered by the JSX runtime.

**Rationale:** This choice follows directly from the transparency and minimal-bundling principle in section 4.1: relying on capabilities already present in the JSX runtime avoids unnecessary bundled code.

Source: [Issue #777](https://github.com/jxn-30/better-moodle/issues/777)

### 5.4 Continued use of `typesafe-i18n`, with a possible future migration — _Open_

**Context:** `typesafe-i18n` has served the project well for translations, but its long-term maintenance status is uncertain, and type generation has run into issues with newer TypeScript versions.

**Decision:** No migration has been made yet; `typesafe-i18n` remains in use.

**Alternatives considered:** `@inlang/paraglide-js` was evaluated in part as a possibly better-typed, actively maintained successor, but has not yet proven convincing enough to justify a migration.

**Rationale:** A migration is considered likely to become necessary if `typesafe-i18n` cannot be made to work with future TypeScript versions or if its maintenance status does not improve. Any long-term solution is also expected to make contributing translations easier than the current process, not merely to replace the underlying library.

Source: [Issue #1039](https://github.com/jxn-30/better-moodle/issues/1039)

<!-- Ideas for further log entries: eslint rules & prettier config; library choices?; userscript vs. browser extension -->

## 6. Use of AI

Better-Moodle does not exist in isolation from the broader shift toward AI-assisted development, and this section sets out how the project expects AI to be used by its contributors.

Using AI is not generally forbidden. Using AI for personal growth and learning is explicitly fine, including while contributing to Better-Moodle. AI should be used as a tool, not as a replacement for independent work. Contributors are expected to understand and be able to independently explain any code they contribute, regardless of how it was produced. Contributors should practice a conscious and responsible use of AI, and are encouraged to use it more as a rubber duck for thinking through problems than as a code generator. Contributions produced with the help of AI are held to the same review standard as any other contribution, as set out in section 4, neither stricter nor more lenient.

## 7. How to Propose Changes to This Document

Better-Moodle's philosophy is expected to evolve alongside the project. Changes to it should not happen unilaterally, but through open discussion.

New ideas or changes to this document should first be raised as a GitHub Discussion, so they can be discussed openly before being formalized. Once there is rough agreement, a pull request against this file can be opened, following the same technical process described in [CONTRIBUTING.md][CONTRIBUTING.md]. Consensus among contributors is the goal for any change, though final decision authority rests with the project's core contributors, as introduced in section 1, who are expected not to exercise this authority lightly.

## 8. Related documents

- [CONTRIBUTING.md][CONTRIBUTING.md] – technical setup, build process, and pull request workflow.
- [README.md][README.md] – feature overview and user-facing FAQ.

<!-- common links that may be used multiple times -->

[CONTRIBUTING.md]: ./CONTRIBUTING.md
[README.md]: ./README.md
[@jxn-30]: https://github.com/jxn-30
[@YorikHansen]: https://github.com/YorikHansen
