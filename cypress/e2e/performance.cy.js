describe('Performance Tests', () => {
  it('homepage loads within acceptable time', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start')
      },
      onLoad: (win) => {
        win.performance.mark('end')
        win.performance.measure('pageLoad', 'start', 'end')
        const measure = win.performance.getEntriesByName('pageLoad')[0]
        
        // Page should load in less than 3 seconds
        expect(measure.duration).to.be.lessThan(3000)
      }
    })
  })

  it('has acceptable First Contentful Paint', () => {
    cy.visit('/')
    cy.window().then((win) => {
      cy.wrap(win.performance.getEntriesByType('paint')).then((entries) => {
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcp) {
          // FCP should be less than 1.5 seconds
          expect(fcp.startTime).to.be.lessThan(1500)
        }
      })
    })
  })

  it('has minimal JavaScript bundle size', () => {
    cy.visit('/')
    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource')
      const jsResources = resources.filter(r => r.name.includes('.js'))
      
      let totalJsSize = 0
      jsResources.forEach(resource => {
        if (resource.transferSize) {
          totalJsSize += resource.transferSize
        }
      })
      
      // Total JS should be less than 500KB (adjust based on your app)
      expect(totalJsSize).to.be.lessThan(500 * 1024)
    })
  })

  it('has no memory leaks on navigation', () => {
    cy.visit('/')
    cy.window().then((win) => {
      const initialMemory = win.performance.memory?.usedJSHeapSize || 0
      
      // Simulate multiple navigations
      for (let i = 0; i < 5; i++) {
        cy.reload()
        cy.wait(500)
      }
      
      cy.window().then((newWin) => {
        const finalMemory = newWin.performance.memory?.usedJSHeapSize || 0
        // Memory should not increase significantly
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).to.be.lessThan(10 * 1024 * 1024) // 10MB
      })
    })
  })

  it('has efficient resource caching', () => {
    // First visit
    cy.visit('/')
    
    // Second visit should use cache
    cy.visit('/')
    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource')
      const cachedResources = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0)
      
      // At least some resources should be cached
      expect(cachedResources.length).to.be.greaterThan(0)
    })
  })
})