import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@components/Footer'

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('contains Netlify logo image', () => {
    render(<Footer />)
    const logo = screen.getByAltText('Netlify Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-netlify.svg')
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('footer')
  })

  it('logo image has correct dimensions', () => {
    render(<Footer />)
    const logo = screen.getByAltText('Netlify Logo')
    expect(logo).toHaveAttribute('width', '71')
    expect(logo).toHaveAttribute('height', '33')
  })

  it('maintains semantic HTML structure', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
    expect(footer.querySelector('img')).toBeInTheDocument()
  })

  it('has accessible role', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders consistently', () => {
    const { container: container1 } = render(<Footer />)
    const { container: container2 } = render(<Footer />)
    expect(container1.innerHTML).toBe(container2.innerHTML)
  })
})