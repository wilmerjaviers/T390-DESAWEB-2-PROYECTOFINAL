# ANADISH - Sistema de Gestión

Sistema web completo desarrollado con Next.js para la gestión integral de solicitudes, beneficiarios y ayudas sociales otorgadas por la organización ANADISH.

## 🎯 Descripción del Proyecto

**ANADISH** es una plataforma web integral desarrollada para la Fundación ANADISH que permite administrar de manera eficiente:

- **Registro de beneficiarios** con sistema de prioridades y validaciones
- **Gestión de solicitudes** de ayuda con diferentes tipos y urgencias
- **Seguimiento de ayudas otorgadas** y estados de entrega
- **Dashboard con estadísticas** en tiempo real y actividades recientes
- **Reportes y gráficos** para análisis de datos y toma de decisiones

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14 + React + TypeScript + Chart.js
- **Estilos**: Bootstrap 5 + Bootstrap Icons + CSS personalizado
- **Base de Datos**: MySQL con mysql2
- **Gráficos**: Chart.js para visualizaciones
- **Autenticación**: Sistema personalizado con Context API
- **UI/UX**: Diseño responsivo con componentes reutilizables

## 📋 Características Principales

### 🏠 Dashboard
- Estadísticas generales del sistema en tiempo real
- Métricas de beneficiarios, solicitudes y ayudas
- Actividades recientes con timestamps
- Indicadores de presupuesto utilizado
- Acciones rápidas para navegación eficiente

### 👥 Gestión de Beneficiarios
- Registro completo con formulario progresivo
- Sistema de prioridades (Alta, Media, Baja) con colores
- Búsqueda avanzada por nombre y cédula
- Validación automática de cédula hondureña (13 dígitos)
- Información geográfica (departamento, municipio)
- Vista previa de datos antes del registro

### 📄 Solicitudes de Ayuda
- Creación de nuevas solicitudes
- Diferentes tipos de ayuda (Medicina, Alimentos, Vivienda, etc.)
- Niveles de urgencia configurables
- Montos estimados con rangos permitidos
- Sistema de aprobación y seguimiento

### 🤝 Gestión de Ayudas
- Registro de ayudas otorgadas con formularios modales
- Control de estados de entrega (Programada, Entregada, Cancelada)
- Seguimiento de montos y fechas programadas
- Vinculación automática con solicitudes aprobadas
- Sistema de aprobación/rechazo con observaciones
- Vista dual: Solicitudes pendientes y Ayudas otorgadas

### 📊 Reportes y Estadísticas
- Gráficos interactivos con Chart.js
- Análisis por tipos de ayuda y urgencias
- Evolución temporal de montos
- Estados de entrega de ayudas

## 🛠️ Instalación y Configuración

### Prerrequisitos

Node.js 18+
MySQL 8.0+
npm, yarn, pnpm o bun
```

### 1. Clonar el repositorio

git clone https://github.com/wilmerjaviers/T390-DESAWEB-2-PROYECTOFINAL.git
cd T390-DESAWEB-2-PROYECTOFINAL
```

### 2. Instalar dependencias

npm install
# o
yarn install
```

### 3. Configurar base de datos
Crear las variables de entorno en `.env.local`:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=anadish_db
DB_PORT=3306
```

### 4. Ejecutar en desarrollo

npm run dev
# o
yarn dev
```

### 5. Acceder a la aplicación
Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (general)/         # Rutas protegidas
│   │   │   ├── Dashboard/     # Panel principal
│   │   │   ├── fichaRegistro/ # Registro de beneficiarios
│   │   │   ├── solicitudNueva/# Nueva solicitud
│   │   │   ├── gestionAyudas/ # Gestión de ayudas
│   │   │   └── reportes/      # Reportes y gráficos
│   │   ├── api/               # API Routes
│   │   │   ├── personas/      # CRUD beneficiarios
│   │   │   ├── solicitudes/   # CRUD solicitudes
│   │   │   ├── ayudas/        # CRUD ayudas
│   │   │   ├── tipos-ayuda/   # Tipos de ayuda
│   │   │   └── dashboard/     # Estadísticas
│   │   ├── components/        # Componentes reutilizables
│   │   ├── Provider/          # Context providers
│   │   ├── Contexto/          # Contextos de React
│   │   ├── Modelos/           # Interfaces TypeScript
│   │   ├── globals.css        # Estilos globales
│   │   └── layout.tsx         # Layout principal
├── db/
│   └── database.ts            # Configuración y queries MySQL
└── public/                    # Archivos estáticos
    ├── logo.png              # Logo de ANADISH
    └── fondo-login.jpg       # Fondo del login
```

## 🗄️ Base de Datos

### Tablas principales:
- **personas**: Beneficiarios del sistema
- **solicitudes**: Solicitudes de ayuda
- **ayudas_otorgadas**: Ayudas aprobadas y entregadas
- **tipos_ayuda**: Catálogo de tipos de ayuda

### Configuración de la base de datos:
```sql
CREATE DATABASE anadish_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🔐 Autenticación

Sistema de autenticación simple con:
- Context API para manejo de estado
- LocalStorage para persistencia
- Rutas protegidas con layout
- Sistema de logout

## 🎨 Interfaz de Usuario

- **Diseño responsivo** compatible con móviles y desktop
- **Bootstrap 5** para componentes y layout
- **Gradientes personalizados** y efectos visuales
- **Iconografía** completa con Bootstrap Icons
- **Modo oscuro** automático según preferencias del sistema

## 📈 Despliegue

### Para producción:

npm run build
npm start
```


**⭐ ANADISH - Sistema de Gestión⭐**

*Desarrollado con ❤️ para ayudar a quienes más lo necesitan*

**T390 - Desarrollo Web 2 - Proyecto Final**

**Version 1.0
