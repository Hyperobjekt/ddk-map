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
- Components are styled using Material UI's theme, Material UI's theme overrides, and Material UI's `makeStyles()`.

## Other Standard Practices
- State is managed in `./src/modules/explorer/store.js`, and accessed like so: `const activeView = useStore(state => state.activeView)`.
- Update state by modifying individual state values with an individual setter `incrementLaunchTour()` or by passing an object to the `setStoreValues()` command:
```
setStoreValues({
  a: 1, // Each of these... 
  b: 2, // is a different node...
  c: 'string' // in the state object.
})
```
- Update and modify large objects (for the map, for example) using `fromJS({})` from 'immutable' ([examples](https://github.com/Hyperobjekt/cpal-components/blob/258f4881d951d99c53218a749d591a452a035a91/src/modules/cpal/explorer/MapView/selectors.js#L41)).

## Visual Style Guide

The client has a [very thorough style guide](https://drive.google.com/drive/folders/1eRv3la42eC-Y2hPqY-rB6qQ4h-Vv7AQS) with many specifications that pertain to maps and graphs. Our work should conform to this style guide, exceptions should be approved by the client.

## Updating data

Several client-supplied data files are stored in s3 buckets. These files are loaded from different locations depending upon the `NODE_ENV` provided to the build script.

* `development`: These files are loaded for local development environments.
* `staging`: These file are staged at [https://hyperobjekt.github.io/untd-map](https://hyperobjekt.github.io/ddk-map) when new commits are pushed to the `staging` branch.
* `production`: These files are loaded by the app when loaded into the production environment.

## Language strings

* A set of language strings resides in `./src/constants`. This is a fallback in case the `langSet` object isn't loaded. This is deepmerged with the loaded `langSet` and then fed into the language translation init.
* A test file to test importing lang strings resides in `./demo/src/`. That is to simulate the lang file loaded when the component is in Gatsby. (The default lang file, therefore, is the one in Gatsby, and from there the strings can be exposed to the CMS.)

## Process.env

When developing locally you need a `.env` file with 3 values: 
```
GATSBY_MAPBOX_USER=***
GATSBY_MAPBOX_API_TOKEN=***
NODE_ENV=development
```
