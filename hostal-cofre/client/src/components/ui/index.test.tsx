import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button, Input, Card, Badge, Modal, Skeleton, EmptyState, Pagination } from './index'

describe('Button', () => {
  it('renders children and fires onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports variants and sizes', () => {
    render(
      <Button variant="danger" size="lg">
        Eliminar
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })

  it('supports the success and outline variants', () => {
    render(
      <div>
        <Button variant="success">Guardar</Button>
        <Button variant="outline">Cancelar</Button>
      </div>,
    )
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('is disabled when disabled or loading', () => {
    render(
      <Button disabled loading>
        Procesando
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Procesando' })).toBeDisabled()
  })
})

describe('Input', () => {
  it('renders label, value and error', () => {
    render(<Input label="Nombre" value="Ana" onChange={() => {}} error="Campo requerido" />)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
  })

  it('renders without label or error', () => {
    render(<Input placeholder="Escribe aquí" />)
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument()
  })
})

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Contenido</Card>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })
})

describe('Badge', () => {
  it('renders children with the info variant by default', () => {
    render(<Badge>Nuevo</Badge>)
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })

  it('supports the success variant', () => {
    render(<Badge variant="success">Listo</Badge>)
    expect(screen.getByText('Listo')).toBeInTheDocument()
  })
})

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="Título">
        Contenido
      </Modal>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders content and closes on backdrop click', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Confirmar">
        Contenido
      </Modal>,
    )
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /×/ }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('Skeleton', () => {
  it('renders with a custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    expect(container.querySelector('.animate-pulse')).toHaveClass('h-10', 'w-full')
  })
})

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="Sin datos" message="Prueba con otro filtro" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
    expect(screen.getByText('Prueba con otro filtro')).toBeInTheDocument()
  })

  it('renders and triggers the action', () => {
    const onClick = vi.fn()
    render(<EmptyState title="Vacío" action={{ label: 'Refrescar', onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Refrescar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Pagination', () => {
  it('returns null when there is a single page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('navigates between pages', () => {
    const onChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onChange={onChange} />)
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(onChange).toHaveBeenCalledWith(1)
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('disables navigation at the boundaries', () => {
    const onChange = vi.fn()
    const { rerender } = render(<Pagination page={1} totalPages={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled()

    rerender(<Pagination page={3} totalPages={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })
})
