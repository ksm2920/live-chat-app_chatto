const authUser = require("../fixtures/auth-user.json");
describe("The Agent Page", () => {
    const { email, password } = authUser;
    it("successfully loads", () => {
        cy.visit("/agent").wait(1000);
    });

    it("succefully log in", () => {
        cy.contains("Sign in with email").click({ force: true });
        cy.get("input[type=email]").type(email);
        cy.get("button[type=submit]").click();
        cy.get("input[type=password]").type(password);
        cy.get("button[type=submit]").click({ force: true });
        cy.contains("Chats");
    });

    it("can start chatting with a customer", () => {
        cy.get("#cy-ongoing").click({ force: true });
        cy.contains("Hello, I have a problem with ........");
        cy.get("input[type=text]").type("Hello, thank you for using “Chatto” service. Can I help you with something?");
        cy.get("button[type=submit]").click();
        cy.contains("Hello, thank you for using “Chatto” service. Can I help you with something?").wait(1000);
    })

    it("can archive a chat", () => {
        cy.get(".leave-btn").click({ force: true });
        cy.get(".archived").click({ force: true }).wait(1000);
    })

    it("succefully log out", () => {
        cy.get(".sign-out").click({ force: true });
    })

});