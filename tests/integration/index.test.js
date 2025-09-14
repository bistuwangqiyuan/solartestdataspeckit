import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@pages/index'

// Mock the Head component from Next.js
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('has correct page title', () => {
    render(<Home />)
    // Since we're mocking Head, we check if the title element exists
    const { container } = render(<Home />)
    const title = container.querySelector('title')
    expect(title).toBeInTheDocument()
    expect(title.textContent).toBe('Next.js Starter!')
  })

  it('renders header with welcome message', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to my app!')).toBeInTheDocument()
  })

  it('renders footer component', () => {
    render(<Home />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('has correct page structure', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('includes description text', () => {
    render(<Home />)
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument()
  })

  it('description includes code element', () => {
    render(<Home />)
    const codeElement = screen.getByText('pages/index.js')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName).toBe('CODE')
  })

  it('has proper accessibility structure', () => {
    render(<Home />)
    // Main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    // Heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    // Footer landmark
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders all major sections', () => {
    render(<Home />)
    // Header section
    expect(screen.getByText('Welcome to my app!')).toBeInTheDocument()
    // Description section
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument()
    // Footer section
    expect(screen.getByAltText('Netlify Logo')).toBeInTheDocument()
  })
})