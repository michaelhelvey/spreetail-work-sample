# Spreetail Work Sample

Small command line application that stores a multi-value string dictionary in
memory. Implemented in Typescript and Node.js.

## Installation & Use

**System Requirements**

_Note: I build and test on Linux (Ubuntu 20.04), but I see nothing about the
project that should not be cross-platform._

-   `yarn 1.x` or `npm 8.x`
-   `node 12.x +` (I use 16.x; CI runs against 12-16)

**Installation**

-   `yarn --dev` or `npm install --dev`

**Execution**

-   `yarn start repl` or `npm start -- repl` (this will open a REPL which will allow execution of commands as
    specified in the requirements document)

## Development Utilities

Several commands are provided for development; for brevity I've only specified
the `yarn` version of these commands.

-   `yarn test` Runs the unit tests for the application with Jest
-   `yarn lint` Runs eslint against the source code.
-   `yarn format` Runs the opininated linter/formatter
    [prettier](https://prettier.io/) against the code base. Note that prettier
    will also run via a pre-commit hook as well.

Note that all of these commands will run on push to `master` or pull request via
Github Actions.

## Author

-   Michael Helvey <michael.helvey1@gmail.com>
