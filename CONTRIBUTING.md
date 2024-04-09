# Contributing to Better-Moodle

Thanks for reading this contribution guide! 😊

> [!NOTE]
> This guide is currently still work in progress. Expect changes, especially clarifications to appear here in the future.

> [!TIP]
> Anything unclear? Feel free to ask @jxn-30 for clarification!

-   [Development](#development)
    -   [Contribution Workflow](#contribution-workflow)
    -   [Pre-Commit](#pre-commit)
    -   [Commit messages](#commit-messages)
    -   [Pull-Requests](#pull-requests)

## Development

### Contribution Workflow

Some steps are

1. clone
2. run `yarn install`
3. develop and test
4. run `yarn run lint:fix` and `yarn run prettier:write` to lint and format. See section [Pre-Commit](#pre-commit)
    1. fix any warnings and errors reported by ESLint
5. commit using [Conventional Commits][cc]. See section [Commit messages](#commit-messages) for more info.
6. Create a Pull-Request

### Pre-Commit

The `package.json` of Better-Moodle includes scripts for formatting (`prettier:write`) and linting (`lint:fix`), the Better-Moodle repository also includes an up-to-date release of [Yarn](https://yarnpkg.com/) package manager.
Please run both scripts with yarn (`yarn run lint:fix` and `yarn run prettier:write`) before committing and also fix any warnings and issues reported by ESLint.

### Commit messages

Better-Moodle uses [Conventional Commits][cc] in its latest version, which is `1.0.0` at the time of writing.
This ensures that [Release Please](https://github.com/googleapis/release-please/) can generate the changelog.
Release Please introduces some additional features such as commit messages that allow to document multiple changes within a single commit.
Please review the docs of Release Please for more information on how to use them.

The use of the `Release-As`-Directive of Release Please is discouraged for use in Better-Moodle main repository.

### Pull-Requests

Your Pull Request should have a meaningful title as well as a content describing the changes introduced by this PR.
There currently is no Pull Request Template available for Better-Moodle.

[cc]: https://www.conventionalcommits.org/
