## Prerequisites

[Node.js](http://nodejs.org/) >= 10 must be installed.

## Installation

- Running `npm install` in the component's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.

## Development Practices

- Code Formatting: [Prettier](https://prettier.io/) (using
  .prettierrc config)
  - [Atom plugin](https://atom.io/packages/prettier-atom)
  - [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Prefer functional components using hooks instead of class
  based components

All modules should:

- Contain an `index.js` the exports any components required
  by other modules

All components should:

- Should opt to use functional components with hooks over
  class components
- Have a `Component.md` that document example usage
- document props accepted using `Component.propTypes`
- provide default props via `Component.defaultProps`

## Updating data

Several client-supplied data files are stored in s3 buckets. These files are loaded from different locations depending upon the `NODE_ENV` provided to the build script.

* `development`: These files are loaded for local development environments.
* `staging`: These file are staged at [https://hyperobjekt.github.io/untd-map](https://hyperobjekt.github.io/ddk-map) when new commits are pushed to the `staging` branch.
* `production`: These files are loaded by the app when loaded into the production environment.
