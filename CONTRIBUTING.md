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

## Branches

- Check out new bbranches from `master`, and submit pull requests back onto `master`.
- To stage the map on Github Pages, merge `master` into `testing`. A Github Action will build and stage on Github Pages at [https://hyperobjekt.github.io/untd-map](https://hyperobjekt.github.io/ddk-map).
- To stage the map on Nelify, merge `master` into `staging`. Netlify will stage the site at [https://staging--tender-mahavira-be8c9a.netlify.app/](https://staging--tender-mahavira-be8c9a.netlify.app/).
- To move changes to the map to production on Nelify, merge `master` into `production`. The production app resides at [https://tender-mahavira-be8c9a.netlify.app/](https://tender-mahavira-be8c9a.netlify.app/).

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

## Language strings

* A set of language strings resides in `./src/constants/lang.js`. This is a fallback in case the `langSet` object isn't loaded. It is deepmerged with the loaded `langSet` and then fed into the language translation init.
* A test file to test importing lang strings resides in `./demo/src/lang.json`. That is to simulate the lang file loaded when the component is in Gatsby at `./config/lang/explorer/lang.json`. (The default lang file, therefore, is the one in Gatsby, because from there the strings will be exposed to the CMS.)
* When developing and staging the app, add new strings to the file in `./demo/src/lang.json`. These changes need to be transferred over to the Gatsby site, and also abstracted to the Gatsby site CMS. These two files are identical in format so you should be able to just copy the file over.

## Process.env

When developing locally you need a `.env` file with 3 values:
```
# Path to AWS bucket where version folders reside.
# Should look like https://[bucket-name].s3.amazonaws.com/proc/
AWS_ENDPOINT=***
GATSBY_MAPBOX_USER=***
GATSBY_MAPBOX_API_TOKEN=***
NODE_ENV=development
```

## Publishing

When you need to publish the app, follow these steps:
1. Update the package version in `package.json`. Use [semantic versioning](https://semver.org/).
2. Run `npm publish`. This publishes the app and pushes it to the npm repository.
3. In the Gatsby site, run `npm update ddk-map`. This updates the map in Gatsby.
4. Run `npm run build` for the Gatsby site to verify that the build is successful.
5. If you need to test tracking or something else that needs more than the development server, run `gatsby serve`.
6. Now you can push the gatsby branch for merge, staging, or production.
