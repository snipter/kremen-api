# Kremen.Deputies

Web app with all open information about [Kremnchuk's](https://goo.gl/maps/QHs6upUwFPM2) districts and deputies. Checkout the app at [https://deputat.io.kr.ua/](https://deputat.io.kr.ua/).

[Official information about Kremnchuk's deputies](http://dep.kremen.gov.ua/?view=deputy).

## Development

Clone project and run:

```bash
yarn install
yarn start
```

Wait for compiling will finish. Then visit: `http://localhost:8080/`. Now you can start to edit source code. After each change source code will recompile and browser window will refresh.

The app uses [Firebase](https://firebase.google.com/) for storing data and host files.

## Style Guide

We are using a linter to make code pretty and safe. Please run linter and check your code before making pull request:

```
yarn lint
```

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of
the reverted commit. In the body, it should say: `These reverts commit <hash>.`, where the hash is
the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system, CI configuration or external dependencies
            (example scopes: gulp, broccoli, npm)
* **chore**: Other changes that don't modify `src` or `test` files
* **release**: Release version commit

### Scope

* For changes in modules (like styles or components) the scope should be module name:
```
feat(components.Button): additional props added
```

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body
Optional. Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
Optional. The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

## Contacts

- IQ Hub (slack): [Slack](https://slack.io.kr.ua/
- Jaroslav Khorishchenko: [https://fb.me/snipter](https://fb.me/snipter)
