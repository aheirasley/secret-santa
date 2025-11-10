# ⚡ Inicio Rápido - Secret Santa

## 🚀 Desplegar en 5 Minutos

### Opción A: Con GitHub (Recomendado)

1. **Sube el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/secret-santa.git
   git push -u origin main
   ```

2. **Despliega en Netlify**:
   - Ve a [netlify.com](https://netlify.com)
   - "Import from Git" → Selecciona tu repo
   - ¡Deploy! (automático)

3. **¡Listo!** Tu sitio estará en: `https://tu-sitio.netlify.app`

---

### Opción B: Sin GitHub

```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Despliega
netlify deploy --prod
```

---

## 🎮 Usar la Aplicación

### Como Admin:
1. Abre tu sitio
2. Login: `admin` / `secretsanta2025`
3. Crear juego → Agregar participantes → Finalizar
4. Copiar y enviar enlaces a cada participante

### Como Participante:
1. Abrir enlace recibido
2. Ver tu asignación secreta
3. ¡Preparar regalo! 🎁

---

## 📁 Estructura Importante

```
secret-santa/
├── public/           ← Frontend (HTML/CSS/JS)
├── netlify/
│   └── functions/    ← Backend (API)
├── lib/              ← Lógica de negocio
└── netlify.toml      ← Configuración
```

---

## 🔑 Credenciales Default

- **Usuario**: `admin`
- **Contraseña**: `secretsanta2025`

Cambiar en: `netlify/functions/auth.js`

---

## ✅ Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Conectado con Netlify
- [ ] Build exitoso
- [ ] Sitio carga correctamente
- [ ] Login funciona
- [ ] Puedes crear juegos
- [ ] Los enlaces de participantes funcionan

---

## 🆘 Ayuda Rápida

**Build falla**:
```bash
npm install
```

**Funciones no responden**:
- Verifica `netlify.toml` existe
- Ve a Functions en Netlify dashboard

**Quiero cambiar colores**:
- Edita `public/css/styles.css` → `:root`

---

## 📚 Más Info

- `README.md` - Documentación completa
- `DEPLOYMENT.md` - Guía detallada de despliegue

---

¡Disfruta tu Intercambio Secreto! 🎅🎄🎁
