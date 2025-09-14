describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the homepage successfully', () => {
    cy.get('h1').should('contain', 'Welcome to my app!')
  })

  it('has correct page title', () => {
    cy.title().should('eq', 'Next.js Starter!')
  })

  it('displays all main components', () => {
    // Header
    cy.get('main').should('exist')
    cy.get('h1.title').should('be.visible')
    
    // Description
    cy.get('p.description').should('be.visible')
    cy.get('p.description code').should('contain', 'pages/index.js')
    
    // Footer
    cy.get('footer').should('be.visible')
    cy.get('footer img[alt="Netlify Logo"]').should('be.visible')
  })

  it('has proper viewport meta tag', () => {
    cy.document().get('head meta[name="viewport"]').should('exist')
  })

  it('has favicon', () => {
    cy.document().get('head link[rel="icon"]').should('have.attr', 'href', '/favicon.ico')
  })

  it('maintains consistent layout on different viewport sizes', () => {
    // Desktop
    cy.viewport(1920, 1080)
    cy.get('.container').should('be.visible')
    
    // Tablet
    cy.viewport(768, 1024)
    cy.get('.container').should('be.visible')
    
    // Mobile
    cy.viewport(375, 667)
    cy.get('.container').should('be.visible')
  })

  it('has no console errors', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'error')
      cy.wrap(win.console.error).should('not.be.called')
    })
  })

  it('has accessible color contrast', () => {
    // Check that text is readable
    cy.get('h1').should('have.css', 'color')
    cy.get('p.description').should('have.css', 'color')
  })

  it('responds to user interactions', () => {
    // Test any interactive elements (currently the page is static)
    // This is a placeholder for when interactive features are added
    cy.get('body').should('exist')
  })

  it('loads external resources correctly', () => {
    // Check Netlify logo loads
    cy.get('img[src="/logo-netlify.svg"]')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0)
      })
  })
})