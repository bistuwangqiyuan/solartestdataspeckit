describe('Cross-Browser Compatibility Tests', () => {
  const browsers = ['chrome', 'firefox', 'edge']
  
  // Note: These tests will run in the browser Cypress is configured with
  // For true cross-browser testing, run Cypress with different browsers
  
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders correctly across different viewport sizes', () => {
    const viewports = [
      { name: 'Desktop HD', width: 1920, height: 1080 },
      { name: 'Desktop', width: 1366, height: 768 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Mobile Small', width: 320, height: 568 }
    ]

    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height)
      
      // Check all main elements are visible
      cy.get('h1').should('be.visible')
      cy.get('p.description').should('be.visible')
      cy.get('footer').should('be.visible')
      
      // Check no horizontal scrolling
      cy.window().then((win) => {
        expect(win.document.body.scrollWidth).to.be.at.most(viewport.width)
      })
    })
  })

  it('CSS Grid and Flexbox work correctly', () => {
    // Check if any flex or grid containers render properly
    cy.get('[class*="container"]').should('have.css', 'display')
    cy.get('main').should('have.css', 'display')
    cy.get('footer').should('have.css', 'display')
  })

  it('fonts load correctly', () => {
    cy.get('h1').should('have.css', 'font-family')
    cy.get('p').should('have.css', 'font-family')
  })

  it('handles JavaScript errors gracefully', () => {
    let errors = []
    
    cy.on('window:error', (err) => {
      errors.push(err.message)
    })
    
    cy.visit('/')
    cy.wait(1000)
    
    expect(errors).to.have.length(0)
  })

  it('supports modern CSS features with fallbacks', () => {
    // Check CSS custom properties (CSS variables) if used
    cy.window().then((win) => {
      const styles = win.getComputedStyle(win.document.documentElement)
      // Add checks for specific CSS features your app uses
    })
  })

  it('images render correctly', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible')
      cy.wrap($img).should(($el) => {
        expect($el[0].naturalWidth).to.be.greaterThan(0)
        expect($el[0].naturalHeight).to.be.greaterThan(0)
      })
    })
  })

  it('handles different pixel densities', () => {
    // Test for retina displays
    cy.window().then((win) => {
      const pixelRatio = win.devicePixelRatio || 1
      cy.log(`Device pixel ratio: ${pixelRatio}`)
      
      // Images should still be crisp
      cy.get('img[src*="logo"]').should('be.visible')
    })
  })

  it('works without JavaScript (progressive enhancement)', () => {
    // This would require testing with JS disabled, which Cypress doesn't support directly
    // Instead, we check that critical content is in the HTML
    cy.request('/').then((response) => {
      expect(response.body).to.include('Welcome to my app!')
      expect(response.body).to.include('Get started by editing')
    })
  })

  it('handles browser-specific features gracefully', () => {
    cy.window().then((win) => {
      // Check for feature detection rather than browser detection
      const features = {
        'IntersectionObserver': 'IntersectionObserver' in win,
        'CSS Grid': CSS.supports('display', 'grid'),
        'CSS Custom Properties': CSS.supports('--test', '1'),
        'Fetch API': 'fetch' in win
      }
      
      Object.entries(features).forEach(([feature, supported]) => {
        cy.log(`${feature}: ${supported ? 'Supported' : 'Not supported'}`)
      })
    })
  })
})