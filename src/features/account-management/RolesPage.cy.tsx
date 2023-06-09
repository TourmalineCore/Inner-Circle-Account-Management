import { API_ROOT, LINK_TO_ACCOUNT_SERVICE } from '../../common/config/config';
import RolesPage from './RolesPage';

const GET_ROLES = `${API_ROOT}${LINK_TO_ACCOUNT_SERVICE}roles`;

describe('RolesPage', () => {
  it('SHOULD render roles table WHEN visit roles page', () => {
    cy.mount(
      <RolesPage />,
    );

    cy.getByData('roles-table').should('exist');
  });
});

describe('AddNewRole', () => {
  it('SHOULD show "add new role" button WHEN showing the table', () => {
    cy.mount(
      <RolesPage />,
    );

    cy.getByData('add-new-role-button').should('exist');
  });

  it('SHOULD add a new role to the table WHEN adding is called', () => {
    cy.intercept('GET', GET_ROLES, []).as('call-1');

    cy.mount(
      <RolesPage />,
    );

    cy.wait('@call-1');

    cy.getByData('add-new-role-button')
      .click();

    cy.getByData('role-column')
      .should('exist');
  });

  it('SHOULD switch to edit mode WHEN adding a role is called', () => {
    cy.intercept('GET', GET_ROLES, []).as('call-2');

    cy.mount(
      <RolesPage />,
    );

    cy.wait('@call-2');

    cy.getByData('add-new-role-button')
      .click();

    cy.getByData('role-name-input')
      .should('exist');
  });

  it('SHOULD send changes made to a role to server WHEN saving them', () => {
    cy.intercept('GET', GET_ROLES, []).as('call-3');

    cy.mount(
      <RolesPage />,
    );

    cy.wait('@call-3');

    cy.getByData('add-new-role-button')
      .click();

    cy.getByData('role-name-input')
      .type('Manager');

    cy.intercept(
      'POST',
      'api/account-management/roles/create',
      {
        name: 'Manager',
        permissions: [],
      },
    ).as('call-4');

    cy.getByData('save-changes-button')
      .click();

    cy.wait('@call-4');

    cy.intercept('GET', GET_ROLES, [{
      name: 'Manager',
      permissions: [],
    }]).as('call-5');
  });

  it('SHOULD discard changes made to a role WHEN cancel is called', () => {
    cy.intercept(
      'GET',
      GET_ROLES,
      [
        {
          id: 1,
          name: 'Admin',
          permissions: [],
        },
        {
          id: 2,
          name: 'Manager',
          permissions: [],
        },
      ],
    ).as('call-6');

    cy.mount(
      <RolesPage />,
    );
    cy.wait('@call-6');
    cy.getByData('edit-role-button-Manager')
      .click();

    cy.contains('Edit').click();

    cy.getByData('role-name-input')
      .type('Barmaley');

    cy.getByData('cancel-changes-button')
      .click();

    cy.getByData('role-name-Manager')
      .should('exist');
  });
});
