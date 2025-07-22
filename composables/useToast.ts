export const useToast = () => {
    const showToast = (message: string, type: 'success' | 'danger' = 'success', duration = 3000) => {
      const event = new CustomEvent('toast:show', {
        detail: { message, type, duration }
      })
      window.dispatchEvent(event)
    }
  
    return { showToast }
  }
  