describe("The Landing Page", () => {
    it("successfully loads", () => {
        cy.visit("/").wait(1000);
    });

    it("The support button works", () => {
        const random = Math.floor(Math.random() * 100) + 1
        cy.get(".support-btn").click();
        cy.contains("Support");
        cy.get("#cy-name").type("test " + random);
        cy.get("#cy-email").type("test@gmail.com");
        cy.get("#cy-msg").type("Hello, I have a problem with ........");
        cy.get("#cy-send-btn").click();
        cy.contains("Chat with us!").wait(1000);
    })
    afterEach(() => {
        cy.saveLocalStorage();
    });
});