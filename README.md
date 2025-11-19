# 📘 Sistema de Gestión y Control – Proyecto Final

Aplicación web para digitalizar el flujo de solicitudes, evaluaciones y emisión de certificados relacionados con Productos Controlados.

---

## 🚀 Tecnologías utilizadas

* **Frontend:** React + Vite + TailwindCSS
* **Backend:** Node.js + Express
* **Base de datos:** Supabase (PostgreSQL + Storage)
* **Control de versiones:** Git + GitHub
* **Ramas:** `main`, `development`, `feature/*`

---

# 🎯 Objetivo del Proyecto

Digitalizar el proceso que actualmente realizan VUS, UPC, Dirección y DNCD para manejar solicitudes, devoluciones, aprobaciones y certificaciones de productos controlados.
El sistema debe permitir enviar, evaluar y firmar documentos de forma digital con trazabilidad completa.

---

# 🧭 Flujo de Trabajo en GitHub (Git Flow Simplificado)

Para mantener el proyecto **ordenado** y evitar conflictos, trabajaremos con el siguiente flujo:

---

## 🌿 Ramas principales

### **`main`**

* Rama estable del proyecto
* Aquí solo se integran funciones probadas y listas para entrega
* 🔒 **Nunca subir cambios directos aquí**

### **`development`**

* Rama donde se integra el trabajo del equipo
* Todas las nuevas funciones llegan aquí mediante Pull Requests
* 🔒 **Tampoco se sube directo**

### **`feature/*`**

Ramas personales para trabajar funciones específicas.

**Formato recomendado:**

```
feature/nombre-de-la-tarea
```

**Ejemplos:**

```
feature/login
feature/solicitudes-clase-a
feature/dashboard-vus
feature/gestion-usuarios
feature/api-solicitudes
```

---

# 🛠️ ¿Cómo debe trabajar cada miembro del equipo?

### **1️⃣ Actualizar el proyecto antes de iniciar**

```bash
git switch development
git pull
```

### **2️⃣ Crear tu propia rama desde development**

```bash
git switch -c feature/nombre-de-la-tarea
```

### **3️⃣ Trabajar y hacer commits**

```bash
git add .
git commit -m "feat: descripción corta de lo que hiciste"
```

### **4️⃣ Subir tu rama al repositorio**

```bash
git push -u origin feature/nombre-de-la-tarea
```

### **5️⃣ Crear un Pull Request en GitHub**

* De tu rama → hacia → `development`
* Un compañero revisa
* Si todo está bien → se hace merge

---

# 📂 Estructura del Repositorio

```
Sistema de Gestión y Control/
 ├── frontend/    → Proyecto React con Vite
 ├── backend/     → API con Node.js y Express
 ├── .gitignore
 └── README.md
```

---

# 🌐 Funcionalidades Principales del Sistema

* Registro de usuarios según rol
* Envío de solicitudes con documentación
* Bandejas de trabajo por rol:

  * VUS
  * UPC
  * Dirección
  * DNCD
* Aprobaciones y devoluciones digitales
* Simulación de firma digital
* Historial completo por expediente
* Entrega de certificados y permisos

---

# 🧑‍🤝‍🧑 Reglas del Equipo

* ❌ No subir nunca a `main` ni a `development` directamente
* ✔️ Cada quien usa su rama `feature/...`
* ✔️ Siempre hacer Pull Requests
* ✔️ Revisar PRs de compañeros antes del merge
* ✔️ Mantener el proyecto actualizado con `git pull`
* ✔️ Escribir commits claros y cortos
* ✔️ Mantener comunicación constante en el grupo

---

# 📩 Comunicación del Equipo

* Avisar cuando una tarea esté bloqueada
* Compartir decisiones importantes
* Subir avances de forma continua (no guardar todo para el final)
* Mantener orden en ramas, commits y PRs

