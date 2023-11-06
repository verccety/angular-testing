describe("Home", () => {
  beforeEach(() => {
    // Load your fixture in advance
    cy.fixture("courses.json").then((coursesJSON) => {
      // Intercept the GET request to the courses API endpoint and respond with your fixture data
      cy.intercept("GET", "/api/courses", coursesJSON).as("coursesRequest");
    });
    cy.visit("/");
  });

  it("should display courses", () => {
    // expect(true).to.equal(true)

    cy.visit("/");
    cy.contains("All Courses");
  });

  it("provides mock data", () => {
    // DEPRECATED
    // cy.fixture("courses.json").as("coursesJSON");
    // cy.server();
    // // @@coursesJSON - для доступа к payload под алиасом
    // cy.route("/api/courses", "@coursesJSON").as("courses");

    // cy.visit("/");
    // cy.contains("All Courses");
    // // ожидаем завершения запроса под алиасом courses
    // cy.wait("@courses");
    // cy.get(".mat-mdc-card-title").should("have.length", 9);

    // Ensure the "All Courses" text is on the page
    cy.contains("All Courses");

    // Wait for the intercepted request to occur and then continue with the tests
    cy.wait("@coursesRequest");

    // Assert that we have the correct number of courses displayed
    cy.get(".mat-mdc-card-title").should("have.length", 9);
  });

  it("should display advanced courses when tab clicked", () => {
    cy.get(".mat-mdc-tab").should("have.length", 2);
    cy.get(".mat-mdc-tab").last().click();

    cy.get(".mat-mdc-card-title").its("length").should("be.gt", 1);
    cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title")
      .first().should("contain", "Angular Security Course");
  });
});
