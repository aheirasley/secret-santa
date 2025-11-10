# 🔧 Configuración de JSONBin para Secret Santa

## 🎯 Por Qué Cambiamos a JSONBin

Netlify Blobs requiere configuración especial que no está disponible en tu plan actual. JSONBin.io es un servicio gratuito y confiable que funciona perfectamente para este proyecto.

---

## 📝 Paso 1: Crear Cuenta en JSONBin (GRATIS)

1. **Ve a**: [https://jsonbin.io](https://jsonbin.io)
2. **Click en "Sign Up"** (arriba derecha)
3. **Regístrate** con tu email
4. **Confirma tu email**

### Plan Gratuito Incluye:
- ✅ Almacenamiento ilimitado de JSONs
- ✅ 10,000 requests/mes (más que suficiente)
- ✅ Sin tarjeta de crédito requerida

---

## 🔑 Paso 2: Obtener tu API Key

1. **Inicia sesión** en JSONBin.io
2. Ve a **"API Keys"** en el menú izquierdo (o visita: https://jsonbin.io/api-keys)
3. **Copia tu Master Key** (empieza con `$2a$10$...`)
   - Se ve algo como: `$2a$10$abcdefghijklmnopqrstuvwxyz1234567890`

**⚠️ IMPORTANTE**: Guarda esta key en un lugar seguro, la necesitarás en el siguiente paso.

---

## ⚙️ Paso 3: Configurar en Netlify

### 3.1 Ir a Environment Variables

1. Ve a tu sitio en **Netlify Dashboard**
2. Click en **"Site configuration"** (menú izquierdo)
3. Click en **"Environment variables"**
4. Click en **"Add a variable"**

### 3.2 Agregar la API Key

**Variable 1:**
- **Key**: `JSONBIN_API_KEY`
- **Value**: `[tu-master-key-de-jsonbin]`
  - Pega el key que copiaste de JSONBin
- **Scope**: Todas las opciones marcadas
- Click en **"Create variable"**

**🎉 ¡Eso es todo!** No necesitas crear el BIN_ID, se creará automáticamente.

---

## 🚀 Paso 4: Desplegar los Cambios

```bash
# En tu computadora, en la carpeta del proyecto:
git add .
git commit -m "Fix: Reemplazado Netlify Blobs con JSONBin"
git push origin main
```

**Netlify redesplegará automáticamente** (1-2 minutos)

---

## ✅ Paso 5: Verificar que Funciona

### 5.1 Esperar el Deploy
- Ve a **Deploys** en Netlify
- Espera a que el estado sea **"Published"** (verde)

### 5.2 Crear tu Primer Juego
1. Abre tu sitio: `https://heiras-ley-secret-santa.netlify.app`
2. Login: `admin` / `secretsanta2025`
3. Crea un juego: "Navidad Heiras Ley 2025"

### 5.3 Revisar los Logs
- Ve a **Functions → games → Function log**
- Deberías ver algo como:

```
Getting games from JSONBin...
No bin ID configured, returning empty games
Saving games to JSONBin...
===========================================
IMPORTANT: New bin created!
Add this to Netlify Environment Variables:
JSONBIN_BIN_ID = 6729abc123def456789
===========================================
Games saved successfully to JSONBin
```

### 5.4 Agregar el BIN ID (Opcional pero Recomendado)

Si ves el mensaje "IMPORTANT: New bin created!" en los logs:

1. **Copia el JSONBIN_BIN_ID** del log
2. Ve a **Site configuration → Environment variables**
3. Click en **"Add a variable"**:
   - **Key**: `JSONBIN_BIN_ID`
   - **Value**: `[el-id-del-log]` (ej: `6729abc123def456789`)
   - Click en **"Create variable"**

4. **Redesplegar** (opcional pero recomendado):
   - Ve a **Deploys → Trigger deploy → Clear cache and deploy**

**Nota**: Si no agregas el BIN_ID, se creará uno nuevo cada vez, pero seguirá funcionando.

---

## 📊 Verificar tus Datos en JSONBin

### Ver tus juegos guardados:

1. Ve a [https://jsonbin.io/bins](https://jsonbin.io/bins)
2. Deberías ver un bin llamado **"secret-santa-data"**
3. Click para ver el contenido JSON con todos tus juegos

### Hacer Backup Manual:

1. Abre el bin en JSONBin
2. Click en **"Download"** para guardar un respaldo

---

## 🎮 Usar la Aplicación

### Como Admin:
1. **Login**: `admin` / `secretsanta2025`
2. **Crear juego**
3. **Agregar participantes**
4. **Finalizar** → Generar asignaciones
5. **Copiar enlaces** y enviarlos

### Como Participante:
1. Abrir enlace recibido
2. Ver tu asignación secreta
3. ¡Preparar regalo! 🎁

---

## 🐛 Solución de Problemas

### Error: "No games found"
✅ **Normal**: Es la primera vez, crea un juego y funcionará

### Error: "JSONBin error: 401"
❌ **Problema**: API Key incorrecta
- Verifica que copiaste la key completa desde JSONBin
- Revisa que la variable en Netlify se llame exactamente `JSONBIN_API_KEY`

### Error: "JSONBin error: 429"
❌ **Problema**: Límite de requests excedido (raro en plan gratuito)
- Espera 1 hora
- O crea una nueva cuenta en JSONBin

### Los datos no persisten después de reiniciar
✅ **Agrega el JSONBIN_BIN_ID** a las variables de entorno (ver paso 5.4)

---

## 💰 Costos

**JSONBin Plan Gratuito:**
- ✅ Gratis para siempre
- ✅ 10,000 requests/mes
- ✅ Para este proyecto: suficiente para 100+ juegos al mes

**Netlify:**
- ✅ Gratis
- ✅ Sin cambios

---

## 📈 Límites del Plan Gratuito

Para uso normal de Secret Santa:
- ✅ Hasta 50 juegos simultáneos: **Perfecto**
- ✅ 100 participantes por juego: **Sin problema**
- ✅ Miles de consultas de participantes: **Funciona bien**

Si necesitas más, el plan Pro de JSONBin es $10/mes (opcional).

---

## 🔄 Exportar/Importar Datos

### Exportar desde la App:
1. Login como admin
2. Abre un juego finalizado
3. Click en **"Exportar CSV"**

### Backup Manual desde JSONBin:
1. Ve a jsonbin.io/bins
2. Abre tu bin "secret-santa-data"
3. Click en "Download" para JSON completo

---

## ✅ Checklist Final

- [ ] Cuenta creada en JSONBin.io
- [ ] API Key copiada
- [ ] Variable `JSONBIN_API_KEY` agregada en Netlify
- [ ] Código pusheado a GitHub
- [ ] Deploy completado (status "Published")
- [ ] Primer juego creado exitosamente
- [ ] BIN_ID agregado a variables (opcional)
- [ ] Enlaces de participantes funcionan

**Si todos los pasos están ✅, ¡tu app está 100% funcional!** 🎉

---

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs en: `Functions → games → Function log`
2. Verifica las variables de entorno en Netlify
3. Asegúrate de que el API key sea correcta

---

## 📞 Recursos

- **JSONBin Docs**: https://jsonbin.io/api-reference
- **Netlify Docs**: https://docs.netlify.com
- **Tu sitio**: https://heiras-ley-secret-santa.netlify.app

---

¡Disfruta tu Intercambio Secreto! 🎅🎄🎁
