const {todoItemsBuilder} = require('../fixtures/generators/todo-item');

describe('Todo application with forced 404s', () => {
  it('seeds the database', function() {
    const todos = todoItemsBuilder();

    /**
     * run the seed task defined in cypress/plugins/index.js
     */
    cy.task('db:seed', {todos});

    /**
     * visit our app so we can see the data in our app
     */
    cy.visit('/');
  });
});
