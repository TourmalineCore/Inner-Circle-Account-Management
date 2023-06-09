describe('RolesPage', () => {
  it('SHOULD test happy path of role creation, editind and deleting WHEN visiting roles page', () => {
    cy.visit('/account-management/roles-page');

    cy.getByData('roles-table')
      .should('exist');

    // adding a role
    cy.getByData('add-new-role-button')
      .click();

    cy.getByData('role-name-input')
      .type('Manager1');

    cy.getByData('permission-checkbox')
      .first()
      .check();

    // saving
    cy.getByData('save-changes-button')
      .click();

    // editing
    cy.getByData('edit-role-button-Manager1')
      .click();

    cy.getByData('role-name-input')
      .type('Manager2');

    cy.getByData('roles-table')
      .contains('Manager2');
  });
});

export {};
