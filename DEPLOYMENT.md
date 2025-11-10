# 🚀 Guía Rápida de Despliegue en Netlify

## Método 1: Despliegue con GitHub (Recomendado)

### Pre-requisitos
- Cuenta en GitHub
- Cuenta en Netlify (gratis)
- Git instalado en tu computadora

### Pasos

1. **Subir código a GitHub**:
   ```bash
   # Navega a la carpeta del proyecto
   cd secret-santa

   # Inicializa Git (si no lo has hecho)
   git init

   # Agrega todos los archivos
   git add .

   # Haz commit
   git commit -m "Initial commit"

   # Crea un repositorio en GitHub y conecta
   git remote add origin https://github.com/TU_USUARIO/secret-santa.git
   git branch -M main
   git push -u origin main
   ```

2. **Conectar con Netlify**:
   - Ve a [https://app.netlify.com](https://app.netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "Deploy with GitHub"
   - Autoriza Netlify
   - Elige el repositorio `secret-santa`

3. **Configuración automática**:
   - Netlify detectará automáticamente `netlify.toml`
   - No necesitas configurar nada manualmente
   - Click en "Deploy site"

4. **Esperar despliegue**:
   - Tarda 1-2 minutos
   - Verás el progreso en tiempo real

5. **¡Listo!**:
   - Tu sitio estará en `https://random-name-123.netlify.app`
   - Puedes cambiar el nombre en "Site settings"

---

## Método 2: Despliegue Directo (Sin Git)

### Usando Netlify CLI

1. **Instalar Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login en Netlify**:
   ```bash
   netlify login
   ```

3. **Inicializar sitio**:
   ```bash
   netlify init
   ```
   - Selecciona "Create & configure a new site"
   - Elige tu team
   - Ingresa un nombre para el sitio

4. **Desplegar**:
   ```bash
   netlify deploy --prod
   ```

---

## Método 3: Drag & Drop (Más Simple)

1. **Preparar archivos**:
   - Instala dependencias localmente:
     ```bash
     npm install
     ```

2. **Crear archivo ZIP**:
   - Comprime toda la carpeta del proyecto (excepto `node_modules/.netlify`)

3. **Subir a Netlify**:
   - Ve a [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Arrastra tu carpeta o archivo ZIP
   - Netlify desplegará automáticamente

   **Nota**: Este método requiere subir el proyecto completo cada vez que hagas cambios.

---

## ✅ Verificación Post-Despliegue

### 1. Verificar que el sitio carga
- Abre la URL asignada por Netlify
- Deberías ver la página de login

### 2. Probar funciones
- Ve a "Functions" en el dashboard de Netlify
- Deberías ver 6 funciones:
  - auth
  - games
  - participants
  - finalize
  - getAssignment
  - export

### 3. Probar login
- Usuario: `admin`
- Contraseña: `secretsanta2025`
- Si funciona, ¡todo está bien!

---

## 🔧 Configuraciones Adicionales

### Cambiar nombre del sitio
1. Ve a "Site settings" → "Site details"
2. Click en "Change site name"
3. Ingresa un nombre único (ej: `mi-intercambio-secreto`)
4. Tu URL será: `https://mi-intercambio-secreto.netlify.app`

### Dominio personalizado
1. Ve a "Domain management" → "Add custom domain"
2. Ingresa tu dominio (ej: `intercambio.midominio.com`)
3. Sigue las instrucciones para configurar DNS
4. Netlify proporciona SSL gratis automáticamente

### Variables de entorno (si las necesitas)
1. Ve a "Site configuration" → "Environment variables"
2. Click en "Add a variable"
3. Agrega tus variables

---

## 🐛 Problemas Comunes

### Build falla
- **Error**: `Module not found`
  - **Solución**: Asegúrate de que `package.json` tenga todas las dependencias
  - Ejecuta `npm install` localmente primero

### Funciones no responden
- **Error**: 404 al llamar funciones
  - **Solución**: Verifica que la carpeta sea `netlify/functions`
  - Revisa el archivo `netlify.toml`

### Blobs no funciona
- **Error**: Error de storage
  - **Solución**: Netlify Blobs está incluido en el plan gratuito
  - Asegúrate de que `@netlify/blobs` esté en dependencias

---

## 📊 Monitoreo

### Ver logs de funciones
1. Ve a "Functions" en el dashboard
2. Click en una función
3. Ve a "Function logs"

### Ver analytics
1. Ve a "Analytics" en el dashboard
2. Puedes ver:
   - Visitas
   - Errores
   - Performance

---

## 🔄 Actualizar la Aplicación

### Con GitHub (Automático)
```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción del cambio"
git push

# Netlify desplegará automáticamente
```

### Con CLI
```bash
netlify deploy --prod
```

---

## 💰 Límites del Plan Gratuito

Netlify ofrece generosamente en su plan gratuito:
- ✅ 100 GB de ancho de banda/mes
- ✅ 300 minutos de build/mes
- ✅ Funciones serverless ilimitadas
- ✅ Netlify Blobs (límite razonable)
- ✅ SSL automático
- ✅ Despliegues ilimitados

Para un proyecto de Secret Santa, el plan gratuito es más que suficiente.

---

## 🎉 ¡Listo para Usar!

Una vez desplegado, puedes:
1. Compartir la URL con quien gestionará los intercambios
2. Esa persona inicia sesión como admin
3. Crea juegos y agrega participantes
4. Comparte los enlaces generados

---

## 📞 Ayuda Adicional

- **Documentación de Netlify**: [https://docs.netlify.com](https://docs.netlify.com)
- **Netlify Blobs**: [https://docs.netlify.com/blobs/overview](https://docs.netlify.com/blobs/overview)
- **Netlify Functions**: [https://docs.netlify.com/functions/overview](https://docs.netlify.com/functions/overview)
