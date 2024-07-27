# FullStackOpen Course
This repository contains the code for the FullStackOpen course. The course is available at [fullstack
open](https://fullstackopen.com/en/).
## Backend Phonebook
### Enrique Anton Lopez

### Despliegue en produccion de backend y frontend compilado
1. Instalar cors `npm install cors` 
   1. modificar `index.js`en backend 
        ````js
        const cors = require('cors')

        app.use(cors())
        ,,,
        ````
2. Compilar frontend `npm run build`
3. Copiar carpeta dist en raiz del backend
   1. Añadir a `index.js`
   2.  `app.use(express.static('dist'))`
   3.  Modificar `/servies/persons.js`
   4. solo url relativa `const baseUrl = '/api/persons'`
4. Subir a Render
   1. Configurar .env y dotenv
   2. Cambiar al final de `index.js` `const PORT = process.env.PORT || 3001`
5. Poder seguir usando el modo desarrollo
- Modificar `vite.config.js`
````js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
````
- Direccion en REnder:
- https://phonebook-backend-iq3n.onrender.com/