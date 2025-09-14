import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

function Application({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#E5E7EB',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#E5E7EB',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#E5E7EB',
            },
          },
        }}
      />
    </>
  )
}

export default Application
