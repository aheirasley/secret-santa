# ⚡ Solución Rápida - Error 500

## 🎯 El Problema
Netlify Blobs no está disponible en tu plan. Cambiamos a JSONBin.io (GRATIS y mejor).

---

## ✅ Solución en 3 Pasos (5 minutos)

### 1️⃣ Crear Cuenta JSONBin (2 min)
- Ve a: https://jsonbin.io
- Sign Up (gratis, sin tarjeta)
- Confirma email
- Copia tu **Master Key** de https://jsonbin.io/api-keys

### 2️⃣ Configurar Netlify (1 min)
- Ve a tu sitio en Netlify
- **Site configuration** → **Environment variables**
- **Add variable**:
  - Key: `JSONBIN_API_KEY`
  - Value: `[pega-tu-master-key]`

### 3️⃣ Desplegar (2 min)
```bash
git add .
git commit -m "Fix: JSONBin storage"
git push origin main
```

Espera 1-2 min → ¡Listo!

---

## 🧪 Probar

1. Abre tu sitio
2. Login: `admin` / `secretsanta2025`
3. Crea un juego
4. ✅ **Debería funcionar!**

---

## 📄 Más Info

Ver [SETUP_JSONBIN.md](SETUP_JSONBIN.md) para instrucciones detalladas.

---

¡Eso es todo! 🎉
