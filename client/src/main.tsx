
import { createRoot } from 'react-dom/client'
import "./i18n";
import App from './App.tsx'
import AOS from "aos";
import "aos/dist/aos.css";
import {HelmetProvider} from 'react-helmet-async'
AOS.init()
createRoot(document.getElementById('root')!).render(
     <HelmetProvider >
<App />
     </HelmetProvider>
    

)
