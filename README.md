# 🎅 Intercambio Secreto - Secret Santa App

Aplicación web completa para gestionar intercambios secretos (Secret Santa) con panel de administración y enlaces únicos para participantes.

## 🌟 Características

- ✅ Panel de administración protegido por contraseña
- ✅ Crear múltiples juegos de intercambio secreto
- ✅ Agregar y gestionar participantes
- ✅ Generación automática de asignaciones (nadie se asigna a sí mismo)
- ✅ Enlaces únicos para cada participante
- ✅ Interfaz en español mexicano
- ✅ Diseño responsive y moderno
- ✅ Exportación de datos a CSV
- ✅ Backend serverless con Netlify Functions
- ✅ Almacenamiento con Netlify Blobs

## 📁 Estructura del Proyecto

```
secret-santa/
├── public/                    # Archivos frontend
│   ├── index.html            # Página de login
│   ├── admin.html            # Panel de administración
│   ├── participant.html      # Vista de participante
│   ├── css/
│   │   └── styles.css        # Estilos
│   └── js/
│       ├── api.js            # Llamadas a la API
│       ├── admin.js          # Lógica del admin
│       └── participant.js    # Lógica del participante
├── netlify/
│   └── functions/            # Funciones serverless
│       ├── auth.js           # Autenticación
│       ├── games.js          # CRUD de juegos
│       ├── participants.js   # Gestión de participantes
│       ├── finalize.js       # Generar asignaciones
│       ├── getAssignment.js  # Obtener asignación
│       └── export.js         # Exportar CSV
├── lib/
│   ├── storage.js            # Wrapper de Netlify Blobs
│   └── secretSanta.js        # Algoritmo de asignación
├── netlify.toml              # Configuración de Netlify
├── package.json              # Dependencias
└── README.md                 # Este archivo
```

## 🚀 Despliegue en Netlify

### Paso 1: Preparar el Proyecto

1. **Crear cuenta en Netlify** (si no tienes una):
   - Visita [https://www.netlify.com/](https://www.netlify.com/)
   - Regístrate con tu cuenta de GitHub, GitLab o email

2. **Crear repositorio en GitHub** (recomendado):
   ```bash
   # Inicializar repositorio Git
   git init

   # Agregar todos los archivos
   git add .

   # Hacer commit
   git commit -m "Initial commit: Secret Santa app"

   # Crear repositorio en GitHub y conectarlo
   git remote add origin https://github.com/TU_USUARIO/secret-santa.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Desplegar desde GitHub

1. **Ir a Netlify Dashboard**:
   - Inicia sesión en [https://app.netlify.com/](https://app.netlify.com/)

2. **Importar proyecto**:
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "Deploy with GitHub"
   - Autoriza a Netlify para acceder a tu GitHub
   - Selecciona el repositorio `secret-santa`

3. **Configurar build settings**:
   - **Build command**: (dejar vacío)
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

   Netlify detectará automáticamente el archivo `netlify.toml`

4. **Deploy**:
   - Click en "Deploy site"
   - Espera a que termine el despliegue (1-2 minutos)

### Paso 3: Configurar Netlify Blobs

1. **Habilitar Netlify Blobs**:
   - En tu sitio de Netlify, ve a "Site configuration" → "Environment variables"
   - Netlify Blobs se activa automáticamente al usar `@netlify/blobs` en las funciones

2. **Verificar funciones**:
   - Ve a "Functions" en el dashboard
   - Deberías ver todas las funciones listadas (auth, games, participants, etc.)

### Paso 4: Verificar el Despliegue

1. **Obtener URL**:
   - Netlify te asignará una URL como: `https://tu-sitio.netlify.app`
   - Puedes cambiar el nombre del sitio en "Site settings" → "Site details" → "Change site name"

2. **Probar la aplicación**:
   - Abre la URL en tu navegador
   - Deberías ver la página de login
   - Credenciales por defecto:
     - **Usuario**: `admin`
     - **Contraseña**: `secretsanta2025`

## 🔧 Desarrollo Local (Opcional)

Si quieres probar la aplicación localmente antes de desplegar:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Instalar Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   netlify dev
   ```

4. **Abrir en el navegador**:
   - La aplicación estará disponible en `http://localhost:8888`

## 📝 Uso de la Aplicación

### Para Administradores

1. **Iniciar sesión**:
   - Accede a la URL de tu sitio
   - Ingresa las credenciales de administrador

2. **Crear un juego**:
   - En el panel de administración, ingresa el nombre del juego (ej: "Navidad 2025")
   - Click en "Crear Juego"

3. **Agregar participantes**:
   - Click en "Gestionar Participantes" en el juego creado
   - Agrega los nombres de todos los participantes uno por uno
   - Puedes eliminar participantes si es necesario

4. **Finalizar y generar enlaces**:
   - Una vez agregados todos los participantes (mínimo 2)
   - Click en "Finalizar y Generar Enlaces"
   - Se generarán asignaciones aleatorias y enlaces únicos

5. **Compartir enlaces**:
   - Copia el enlace de cada participante
   - Envíaselo por WhatsApp, email, o tu método preferido
   - Cada enlace es único y solo muestra la información de ese participante

6. **Exportar datos** (opcional):
   - Click en "Exportar CSV" para descargar un archivo con todos los datos
   - Útil para respaldo o registro

### Para Participantes

1. **Abrir el enlace recibido**:
   - Cada participante recibe un enlace único del administrador
   - Ejemplo: `https://tu-sitio.netlify.app/participant.html?token=abc123`

2. **Ver asignación**:
   - Al abrir el enlace, verán su nombre y a quién deben hacerle el regalo
   - El enlace es personal y no debe compartirse

## 🔒 Seguridad

- Las credenciales de administrador están hardcodeadas en `netlify/functions/auth.js`
- Para cambiar las credenciales, edita las líneas:
  ```javascript
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'secretsanta2025';
  ```
- Cada participante tiene un token único UUID v4
- Los datos se almacenan de forma segura en Netlify Blobs

## 🎨 Personalización

### Cambiar Credenciales de Admin

Edita `netlify/functions/auth.js`:
```javascript
const ADMIN_USERNAME = 'tu_usuario';
const ADMIN_PASSWORD = 'tu_contraseña_segura';
```

### Cambiar Colores

Edita `public/css/styles.css` en la sección `:root`:
```css
:root {
    --primary-color: #c41e3a;      /* Rojo navideño */
    --secondary-color: #165b33;    /* Verde navideño */
    --accent-color: #ffd700;       /* Dorado */
}
```

### Cambiar Textos

Todos los textos están en español mexicano en los archivos HTML y JavaScript en la carpeta `public/`.

## 🐛 Solución de Problemas

### Error: "No autorizado" al crear juegos
- Verifica que las credenciales sean correctas
- Limpia el sessionStorage del navegador
- Vuelve a iniciar sesión

### Funciones no responden
- Verifica en Netlify Dashboard → Functions que todas estén desplegadas
- Revisa los logs de las funciones en Netlify

### Enlaces de participantes no funcionan
- Asegúrate de haber finalizado el juego
- Verifica que el token en la URL sea correcto
- Revisa los logs de la función `getAssignment`

### Datos no se guardan
- Verifica que Netlify Blobs esté habilitado
- Revisa los logs de las funciones de storage
- Asegúrate de tener un plan que incluya Netlify Blobs

## 📦 Dependencias

- **@netlify/blobs**: Almacenamiento de datos
- **uuid**: Generación de IDs únicos

## 📄 Licencia

MIT License - Libre para usar y modificar

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o pull requests.

## 📞 Soporte

Para reportar problemas o solicitar características, abre un issue en GitHub.

---

¡Felices intercambios secretos! 🎁🎄
