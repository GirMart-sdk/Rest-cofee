import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button, Input, Card, Badge, Modal } from './index'

describe('ui components', () => {
  it('renders a primary button with children and calls onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)
    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveClass('bg-primary')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a button with secondary/danger/ghost variants and sizes', () => {
    const { rerender } = render(
      <Button variant="secondary" size="sm">
        A
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('bg-gray-100', 'px-3')
    rerender(
      <Button variant="danger" size="lg">
        A
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('bg-accent', 'px-6')
    rerender(
      <Button variant="ghost" size="md">
        A
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'px-4')
  })

  it('disables the button while loading and shows a spinner', () => {
    render(<Button loading>Enviar</Button>)
    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('supports submit buttons and extra classes', () => {
    render(
      <Button type="submit" className="w-full">
        OK
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('renders an input with a label and forwards props', () => {
    render(<Input label="Nombre" placeholder="Escribe" value="Ana" onChange={() => {}} />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Escribe') as HTMLInputElement
    expect(input.value).toBe('Ana')
  })

  it('renders an input with an error message', () => {
    render(<Input label="Email" error="Email inválido" />)
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300')
  })

  it('renders a card with children', () => {
    render(<Card>Contenido de la tarjeta</Card>)
    expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument()
  })

  it('renders badges with each variant', () => {
    const { rerender } = render(<Badge>Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('bg-blue-100')
    rerender(<Badge variant="success">Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('bg-green-100')
    rerender(<Badge variant="warning">Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('bg-yellow-100')
    rerender(<Badge variant="danger">Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('bg-red-100')
  })

  it('renders nothing when the modal is closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Título">
        Cuerpo
      </Modal>,
    )
    expect(screen.queryByText('Título')).not.toBeInTheDocument()
  })

  it('renders the modal content and closes on backdrop or close button', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open onClose={onClose} title="Título">
        Cuerpo
      </Modal>,
    )
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Cuerpo')).toBeInTheDocument()

    fireEvent.click(container.querySelector('.fixed.inset-0.bg-black\\/50') as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
