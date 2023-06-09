/* eslint-disable no-useless-escape */
describe('Adding a new user in the system via email sending', () => {
  it('SHOULD successfully add a new user in the acccount management', () => {
    let accessToken: string;
    let mailSlurpEmailId: string;
    let mailSlurpEmail: string;
    cy.request({
      method: 'POST',
      url: 'https://innercircle.dev.tourmalinecore.com/api/auth/login',
      body: {
        login: 'ceo@tourmalinecore.com',
        password: 'cEoPa$$wo1d',
      },
    })
      .then((response) => {
        accessToken = response.body.accessToken.value;
      });

    cy.mailslurp()
      .then((mailslurp) => mailslurp.createInbox())
      .then((inbox) => {
        mailSlurpEmailId = inbox.id;
        mailSlurpEmail = inbox.emailAddress;
      })
      .then(() => {
        cy.request({
          method: 'POST',
          url: 'https://innercircle.dev.tourmalinecore.com/api/account-management/accounts/create',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            firstName: 'Test1',
            lastName: 'Testov2',
            middleName: 'Testovich3',
            corporateEmail: mailSlurpEmail,
            roleIds: [2],
          },
        });
      })
      .then(() => {
        cy.mailslurp()
          .then((mailslurp) => mailslurp.waitForLatestEmail(mailSlurpEmailId, 30000, true))
          .then((email) => {
            const regex = /(https:\/\/innercircle\.dev\.tourmalinecore\.com\/auth\/change-password\?passwordResetToken=[\w%\-]+&corporateEmail=[\w%\-]+@mailslurp\.com)/;
            // @ts-ignore
            const verificationLink = email.body.match(regex)[0];

            // visit the verification link and complete registration
            const newPassword = 'Testtest123!';
            cy.visit(verificationLink);

            cy.get('#password').type(newPassword);
            cy.contains('Done')
              .click();
            cy.contains('LogOut')
              .click();
            cy.request({
              method: 'POST',
              url: `https://innercircle.dev.tourmalinecore.com/api/auth/reset?corporateEmail=${mailSlurpEmail}`,
            });
            cy.mailslurp()
              .then((mailslurp) => mailslurp.waitForLatestEmail(mailSlurpEmailId, 30000, true))
              .then((email2) => {
                const regex2 = /(https:\/\/innercircle\.dev\.tourmalinecore\.com\/auth\/change-password\?passwordResetToken=[\w%\-]+&corporateEmail=[\w%\-]+@mailslurp\.com)/;
                // @ts-ignore
                const verificationLink2 = email2.body.match(regex2)[0];

                const newPassword2 = 'Testtest1234!';
                cy.visit(verificationLink2);
                cy.get('#password')
                  .type(newPassword2);
                cy.contains('Done')
                  .click();
                cy.contains('LogOut')
                  .click();
                cy.get('#login')
                  .type(mailSlurpEmail);
                cy.get('#password')
                  .type(newPassword);
                cy.contains('Log In')
                  .click();
                cy.get('.auth-page__result-message')
                  .should('have.text', 'Error: Invalid email or password. Check the correctness of the entered data.');
                cy.get('#password')
                  .type(newPassword2);
                cy.contains('Log In')
                  .click();
                cy.get(':nth-child(1) > .sidebar-item')
                  .should('have.text', 'Profile');
              });
          });
      });
  });
});
