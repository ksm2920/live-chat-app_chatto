const authUser = require("../fixtures/auth-user.json");
describe("The Agent Page", () => {
    const { email, password } = authUser;
    beforeEach(() => {
        cy.restoreLocalStorage();
      });

    it("successfully loads", () => {
        cy.visit("/agent").wait(1000);
    });
    
    //agent
    it("succefully log in", () => {
        cy.contains("Sign in with email").click({ force: true });
        cy.get("input[type=email]").type(email);
        cy.get("button[type=submit]").click();
        cy.get("input[type=password]").type(password);
        cy.get("button[type=submit]").click({ force: true });
        cy.contains("Chats");
    });

    it("can start chatting with a customer", () => {
        cy.contains(/^t\w+/).click({ force: true });
        cy.contains("Hello, I have a problem with ........");
        cy.get("input[type=text]").type("Hello, thank you for using “Chatto” service. Can I help you with something?");
        cy.get("button[type=submit]").click();
        cy.contains("Hello, thank you for using “Chatto” service. Can I help you with something?").wait(1000);
        cy.get("input[type=text]").type("I would like to recommend “solution” that fits your requirements.");
        cy.get("button[type=submit]").click();
    })

    it("succefully log out", () => {
        cy.get(".sign-out").click({ force: true });
    })

    beforeEach(() => {
        cy.restoreLocalStorage();
      });

    //customer
    it("can get a message from the agent and reply to the agent", () => {
        cy.visit("/").wait(1000);
        cy.contains("Chat with us!").wait(1000);
        cy.contains("I would like to recommend “solution” that fits your requirements.");
        cy.get("input[type=text]").type("Okay! Thanks for your help!");
        cy.get("button[type=submit]").click().wait(1000);
    })

    //archive a finished chat
    it("succefully log in", () => {
        cy.visit("/agent").wait(1000);
        cy.contains("Sign in with email").click({ force: true });
        cy.get("input[type=email]").type(email);
        cy.get("button[type=submit]").click();
        cy.get("input[type=password]").type(password);
        cy.get("button[type=submit]").click({ force: true });
        cy.contains("Chats");
    });

    it("can get a message from the customer", () => {
        cy.contains(/^t\w+/).click({ force: true });
        cy.contains("Okay! Thanks for your help!");
        cy.get("input[type=text]").type("Thank you for visiting our website. Hope to see you once again. Good day.");
        cy.get("button[type=submit]").click();
    })

    it("can archive a chat", () => {
        cy.get(".leave-btn").click({ force: true });
        cy.get(".archived").click({ force: true }).wait(1000);
    })

    it("succefully log out", () => {
        cy.get(".sign-out").click({ force: true });
    })

});