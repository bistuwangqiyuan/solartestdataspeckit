import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '@components/Header'

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders with default title when no title prop is provided', () => {
    render(<Header />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Welcome to Next.js!')
  })

  it('renders with custom title when title prop is provided', () => {
    const customTitle = 'Test Application'
    render(<Header title={customTitle} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(customTitle)
  })

  it('applies correct CSS classes', () => {
    render(<Header />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('title')
  })

  it('renders description paragraph', () => {
    render(<Header />)
    const description = screen.getByText(/Get started by editing/i)
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('description')
  })

  it('renders code element with correct text', () => {
    render(<Header />)
    const codeElement = screen.getByText('pages/index.js')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName).toBe('CODE')
  })

  it('maintains semantic HTML structure', () => {
    const { container } = render(<Header />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main.querySelector('h1')).toBeInTheDocument()
    expect(main.querySelector('p.description')).toBeInTheDocument()
  })

  it('renders consistently with same props', () => {
    const { container: container1 } = render(<Header title="Test" />)
    const { container: container2 } = render(<Header title="Test" />)
    expect(container1.innerHTML).toBe(container2.innerHTML)
  })
})