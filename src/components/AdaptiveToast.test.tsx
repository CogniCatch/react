import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import { AdaptiveToastProvider, triggerAdaptiveToast, adaptiveToast } from './AdaptiveToast'

vi.mock('sonner', async (importOriginal) => {
  const actual = await importOriginal<typeof import('sonner')>()
  
  const mockToast = vi.fn() as any
  
  mockToast.loading = vi.fn()
  mockToast.custom = vi.fn()
  mockToast.success = vi.fn()
  mockToast.error = vi.fn()

  return {
    ...actual,
    toast: mockToast,
  }
})

describe('Adaptive Toast System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AdaptiveToastProvider', () => {
    it('renders the Sonner Toaster component with default props', () => {
      render(<AdaptiveToastProvider />)
      const region = screen.getByRole('region', { name: /Notifications/i })
      expect(region).toBeDefined()
    })

    it('passes custom position and theme props', () => {
      render(<AdaptiveToastProvider position="bottom-left" customTheme={{ borderRadius: '10px' }} />)
      expect(screen.getByRole('region', { name: /Notifications/i })).toBeDefined()
    })
  })

  describe('triggerAdaptiveToast', () => {
    it('calls toast with correct arguments for medium severity (default)', () => {
      triggerAdaptiveToast('Test Error', 'Something went wrong')

      expect(toast).toHaveBeenCalledWith('Test Error', expect.objectContaining({
        description: 'Something went wrong',
        duration: 5000,
        action: undefined
      }))
    })

    it('calls toast with longer duration for high severity', () => {
      triggerAdaptiveToast('Critical', 'System down', undefined, undefined, 'high')

      expect(toast).toHaveBeenCalledWith('Critical', expect.objectContaining({
        duration: 8000
      }))
    })

  })

  describe('adaptiveToast Object Methods', () => {
    it('success method calls toast with success arguments', () => {
      adaptiveToast.success('Saved', 'File saved successfully')
      expect(toast).toHaveBeenCalledWith('Saved', expect.objectContaining({
        description: 'File saved successfully'
      }))
    })

    it('error method calls toast with error arguments', () => {
      adaptiveToast.error('Failed', 'Could not save file')
      expect(toast).toHaveBeenCalledWith('Failed', expect.objectContaining({
        description: 'Could not save file'
      }))
    })

    it('loading method calls toast.loading', () => {
      adaptiveToast.loading('Uploading...', 'Please wait')
      expect(toast.loading).toHaveBeenCalledWith('Uploading...', { description: 'Please wait' })
    })

    it('custom method calls toast.custom', () => {
      adaptiveToast.custom('Custom', 'Message', { backgroundColor: '#000' })
      expect(toast.custom).toHaveBeenCalled()
    })
  })
})
