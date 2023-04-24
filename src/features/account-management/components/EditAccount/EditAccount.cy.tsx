import { LINK_TO_ACCOUNT_SERVICE, API_ROOT } from '../../../../common/config/config';
import EditAccount from './EditAccount';

describe('EditAccount', () => {
  it('SHOULD render no edit page WHEN there is component', () => {
    mountComponent();

    cy.getByData('edit-account')
      .should('exist');
  });

  it('SHOULD call the backend to get data WHEN it wants to render corporate email', () => {
    cy.intercept(
      'GET',
      `${API_ROOT}${LINK_TO_ACCOUNT_SERVICE}accounts/1`,
      {
        corporateEmail: 'test@tourmalinecore.com',
        firstName: '',
        lastName: '',
        roles: [
          {
            id: 1,
            name: 'CEO',
          },
        ],
      },
    );

    mountComponent();

    cy.getByData('corporate-email')
      .should('have.text', 'test@tourmalinecore.com');
  });
});

function mountComponent() {
  cy.mount(
    <EditAccount />,
  );
}