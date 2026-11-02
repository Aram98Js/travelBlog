
import { createRoot } from 'react-dom/client'
import "./i18n";
import App from './App.tsx'
import AOS from "aos";
import "aos/dist/aos.css";
import {HelmetProvider} from 'react-helmet-async'
import {GoogleOAuthProvider} from '@react-oauth/google'
import './index.scss'
AOS.init()
createRoot(document.getElementById('root')!).render(
     <HelmetProvider >

           <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>

     </HelmetProvider>
    

)
