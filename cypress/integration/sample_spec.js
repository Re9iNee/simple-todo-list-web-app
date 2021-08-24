/* eslint-disable no-undef */
// Start Our Application Code
function add(title) {
  const addBtn = cy.get("#addBtn");
  addBtn.click();
  const modal = cy.get("#myModal");
  modal.should("have.class", "active");
  const modalInput = cy.get("#modalInput");
  // NOTE: Add Delay to make it look cool
  modalInput.type(title);
  cy.get("#myModal.active").submit();
}
// End of Application Code
const title = "Watch Jungle Cruise";
// Test Cases
describe("basics", function () {
  beforeEach(() => {
    cy.visit("localhost:3000");
    // Add a single task
    add(title);
  });
  it("adds task", function () {
    cy.get("li")
      .should("have.text", title)
      .should(() => {
        // check if it has been added to localStorage
        const dataString = localStorage.getItem("default");
        const data = JSON.parse(dataString);
        const title = data[0].title;
        expect(title).to.eq(title);
      });
  });
  it("changes background on click", function () {
    cy.get("li")
      .click()
      .should("have.css", "background-color", "rgb(255, 255, 0)");
  });
  it("rename task", function () {
    cy.get("li").dblclick();
    cy.get("#myModal").should("have.class", "active");
    cy.get("#modalInput").clear().type("new title");
    cy.get("#myModal.active").submit();

    cy.get("li")
      .should("have.text", "new title")
      .should(() => {
        const dataString = localStorage.getItem("default");
        const data = JSON.parse(dataString);
        const title = data[0].title;
        expect(title).to.eq(title);
      });
  });

  it("indent task", function () {
    const nTitle = "something new";
    add(nTitle);
    const nTask = cy.get("li").contains(nTitle);
    nTask.click().trigger("keydown", { keyCode: 9 });
    cy.wait(200);
    cy.get("[data-test=child-task]").should("have.text", nTitle);
  });

it("delete task", function () {
    cy.get("li").contains(title).click().type('{command+backspace}')
    cy.get('[data-test=parent-container]').should('be.empty')
  });
});

// What basic Things our app Does:
// Adds task
// Rename task
// Indent / Outdent

// FIXME: Specified tests: form shouldnt be sumbitted on empty string - required input won't stop it
// TODO: Keyboard Navigation
// TODO: tasks are loading after page load. (cy.reload())
// TODO: it delets child task