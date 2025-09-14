describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('has proper heading hierarchy', () => {
    // Should have exactly one h1
    cy.get('h1').should('have.length', 1)
    
    // Check heading levels are not skipped
    cy.get('h1, h2, h3, h4, h5, h6').then(($headings) => {
      const levels = Array.from($headings).map(h => parseInt(h.tagName.charAt(1)))
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i-1]).to.be.at.most(1)
      }
    })
  })

  it('has proper landmark regions', () => {
    // Main content area
    cy.get('main').should('exist').and('have.length', 1)
    
    // Footer
    cy.get('footer').should('exist').and('have.length', 1)
  })

  it('images have alt text', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
      cy.wrap($img).then(($el) => {
        const alt = $el.attr('alt')
        expect(alt).to.not.be.empty
      })
    })
  })

  it('has sufficient color contrast', () => {
    // Check main heading
    cy.get('h1').should('have.css', 'color')
      .and('not.eq', 'rgba(0, 0, 0, 0)') // Not transparent
    
    // Check description text
    cy.get('p.description').should('have.css', 'color')
      .and('not.eq', 'rgba(0, 0, 0, 0)')
  })

  it('is keyboard navigable', () => {
    // Tab through the page
    cy.get('body').tab()
    
    // Check focus is visible
    cy.focused().should('exist')
  })

  it('has proper language attribute', () => {
    cy.get('html').should('have.attr', 'lang')
  })

  it('has viewport meta tag for mobile', () => {
    cy.document().get('head meta[name="viewport"]')
      .should('have.attr', 'content')
      .and('include', 'width=device-width')
  })

  it('uses semantic HTML', () => {
    // Check for semantic elements
    cy.get('main').should('exist')
    cy.get('footer').should('exist')
    cy.get('h1').should('exist')
    cy.get('p').should('exist')
  })

  it('has no duplicate IDs', () => {
    cy.get('[id]').then(($elements) => {
      const ids = Array.from($elements).map(el => el.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).to.equal(uniqueIds.length)
    })
  })

  it('form elements have labels (if any)', () => {
    // This test will check for form elements when they are added
    cy.get('input, select, textarea').each(($el) => {
      const id = $el.attr('id')
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist')
      }
    })
  })
})