# Test Production Ready Apps with Cypress

Notes and annotations for Egghead's [Test Production Ready Apps with Cypress](Test Production Ready Apps with Cypress) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [1. Course Introduction: Test Production Ready Apps with Cypress](#1-course-introduction-test-production-ready-apps-with-cypress)
- [2. Install Cypress in a Production Application](#2-install-cypress-in-a-production-application)
- [3. Setup Your Cypress Dev Environment](#3-setup-your-cypress-dev-environment)
  - [Custom Typescript config for code hints](#custom-typescript-config-for-code-hints)
  - [Cypress project configs](#cypress-project-configs)
- [4. Write Your First Cypress Integration Test](#4-write-your-first-cypress-integration-test)
  - [Using `@testing-library/cypress`](#using-testing-librarycypress)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 1. Course Introduction: Test Production Ready Apps with Cypress

End-to-end testing has a reputation of being flaky and unreliable, with tests
having to be written in such a way that _sleeps_ and waiting are required for
DOM nodes to be evaluated.

Cypress addresses these issues, and more. Cypress is a paradigm shift in in
end-to-end testing.

With Cypress one can test every layer of the stack:

- database
- api
- asynchronous requests
- UI
- frontend stores

Cypress allows this in addition to features such as time travel.

## 2. Install Cypress in a Production Application

```bash
$ npm i -D cypress
```

With Cypress installed, we can run the GUI:

```bash
$ $(npm bin)/cypress open
```

This will open the GUI, and, if Cypress has not been run in the project, create
a number of files and folders to prepare your tests and allow you to evaluate a
few examples of Cypress tests against the Cypress website.

```bash
cypress
├── fixtures
│   └── example.json
├── integration
│   └── examples
│       ├── actions.spec.js
│       ├── aliasing.spec.js
│       ├── assertions.spec.js
│       ├── connectors.spec.js
│       ├── cookies.spec.js
│       ├── cypress_api.spec.js
│       ├── files.spec.js
│       ├── local_storage.spec.js
│       ├── location.spec.js
│       ├── misc.spec.js
│       ├── navigation.spec.js
│       ├── network_requests.spec.js
│       ├── querying.spec.js
│       ├── spies_stubs_clocks.spec.js
│       ├── traversal.spec.js
│       ├── utilities.spec.js
│       ├── viewport.spec.js
│       ├── waiting.spec.js
│       └── window.spec.js
├── plugins
│   └── index.js
└── support
    ├── commands.js
    └── index.js
```

This also demonstrates that Cypress can be run against both local and remote
applications.

## 3. Setup Your Cypress Dev Environment

### Custom Typescript config for code hints

The example Cypress test files include a triple-slash directive for
intelli-sense in VSCode.

```javascript
/// <reference types="Cypress" />
```

This doesn't help in Vim, but we can rename specs to `.ts`, and omni-completion
will kick in (given you have the correct plugins).

This doesn't mean that the triple-slash directive can be removed, however, as
your project may not be configured for Typescript, or for Typescript to find
Cypress definitions.

To address this, a `tsconfig.json` can be added to the root of of the `cypress/`
folder indicating to Typescript where to find definitions for Cypress:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": ["cypress"]
  },
  "include": ["**/*.*"]
}
```

Now it's safe to remove the triple-slash directive and benefit from
omni-completion / intelli-sense.

### Cypress project configs

Cypress has many configurable settings that can be managed via a `cypress.json`
in the root of one's project. One such setting is the `baseUrl` for requests:

```json
{
  "baseUrl": "http://localhost:5000"
}
```

## 4. Write Your First Cypress Integration Test

Let's start from scratch with our own spec: [todos.spec.ts](./cypress/integration/todos.spec.ts)

The first thing to do is to get Cypress to visit our application:

```javascript
describe('My application', () => {
  /**
   * Visit the index page of our application at the url defined in cypress.json
   */
  cy.visit('/')
})
```

We then `get` elements using Cypress' chained method:

```javascript
describe('My application', () => {
  cy.visit('/')
  cy.get('.todo-list li:nth-child(1)')
    .should('have.text', 'hello world');
})
```

Cypress uses jQuery under the hood, so we can use CSS selectors to get our
elements. Assertions are then chained using `.should([assertionName], [valueToAsssert])`.

We can also open Chrome's devtools, click on an assertion in the main window,
and then view details about that assertion in the devtools console.

### Using `@testing-library/cypress`

We can improve on these assertions by using [`@testing-library/cypress`](https://testing-library.com/docs/cypress-testing-library/intro).

To get `@testing-library/cypress`'s helper commands, we need to first install
the library:

```bash
$ npm install -D @testing-library/cypress
```

and then extend Cypress' commands:

```javascript
# cypress/support/commands.js
import '@testing-library/cypress/add-commands';
```

and then, if using Typescript, add `@testing-library`s types:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": ["cypress", "@types/testing-library__cypress"]
  },
  "include": ["**/*.*"]
}
```

Now we have access to a number of `@testing-library/dom` commands to easily get
elements.

Instead of looking for elements using brittle CSS selectors, we can instead get
elements by how they appear to users:

```javascript
describe('My application', () => {
  cy.visit('/')

  cy.findByText(/hello world/i)
    .should('exist');
})
```

When Cypress is unable to find an element it waits (4500ms by default) for the
element to change, after which it will throw an error.

This eliminates having to write code that sleeps or waits for the DOM to change
with Cypress.

We can continue chaining assertions, too:

```javascript
  cy.findByText(/hello world/i)
    .should('exist')
    .should('not.have.class', 'completed')
    .parent()
    .find('.toggle')
    .should('not.be.checked')
```

Assertions are run one after the other
