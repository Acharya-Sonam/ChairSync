import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import './App.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({
    onNeedRefresh() {
        if (confirm('A new version of ChairSync is available. Reload now?')) {
            window.location.reload()
        }
    },
    onOfflineReady() {
        console.log('ChairSync is ready to work offline.')
    },
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
