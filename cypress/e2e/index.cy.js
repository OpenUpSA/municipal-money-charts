describe("empty spec", () => {
  it("passes", () => {
    cy.visit("/").contains("Original budget");
  });
});
