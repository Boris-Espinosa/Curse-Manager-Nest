# 📚 Curse Manager API

[English](#english) | [Español](#español)

---

<a name="english"></a>

## 🇬🇧 English

### 📖 Description

Curse Manager API is a RESTful backend service built with NestJS for managing online courses and student enrollments. It provides a complete platform where instructors can create and manage courses, students can enroll in available courses, and administrators can oversee the entire system with role-based access control and secure authentication.

### 🎯 Problem it Solves

- **Course Management**: Instructors can create, update, and delete their courses in one centralized platform
- **Student Enrollments**: Students can browse available courses and enroll/unenroll easily
- **Role-Based Access Control**: Three-tier user system (Admin, Instructor, Student) with specific permissions for each role
- **User Authorization**: Only course creators can modify their courses; users can only modify their own profiles
- **Enrollment Tracking**: Keep a complete record of all course enrollments with timestamps
- **Secure Authentication**: JWT-based authentication ensures data privacy and secure access
- **Course Discovery**: Students can view all available courses and their instructors

### 🛠️ Technologies Used

#### Backend Stack

- **NestJS (v11)** - Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript (v5.7)** - Strongly typed programming language that builds on JavaScript
- **TypeORM (v0.3.27)** - Object-Relational Mapping library for TypeScript and JavaScript
- **MySQL** - Relational database management system (mysql2 v3.15)
- **JWT (@nestjs/jwt v11)** - JSON Web Tokens for secure authentication
- **Bcrypt (v6.0)** - Password hashing and encryption
- **Class-validator (v0.14)** - Decorator-based validation for DTOs
- **Class-transformer (v0.5)** - Object transformation and serialization
- **RxJS (v7.8)** - Reactive programming library
- **Jest (v30)** - Testing framework
- **ESLint + Prettier** - Code linting and formatting

### 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL database (local or remote)
- npm or yarn package manager

### ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Boris-Espinosa/Curse-Manager-Nest.git
cd Curse-Manager-Nest
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=curse_manager

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Application Port
PORT=3000
```

4. Start the development server:

```bash
npm run start:dev
```

### 🚀 Available Scripts

- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot-reload
- `npm run start:debug` - Start the server in debug mode
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### 📡 API Endpoints

#### Authentication (`/auth`)

| Method | Endpoint          | Description        | Auth Required |
| ------ | ----------------- | ------------------ | ------------- |
| POST   | `/auth/register`  | Register new user  | No            |
| POST   | `/auth/login`     | Login user         | No            |

#### Users (`/users`)

| Method | Endpoint       | Description               | Auth Required | Roles Allowed |
| ------ | -------------- | ------------------------- | ------------- | ------------- |
| POST   | `/`            | Register user             | No            | -             |
| GET    | `/`            | Get all users             | No            | -             |
| GET    | `/:email`      | Get user by email         | No            | -             |
| PATCH  | `/:id`         | Update user               | Yes           | User/Admin    |
| DELETE | `/:id`         | Delete user               | Yes           | User/Admin    |

#### Courses (`/curses`)

| Method | Endpoint           | Description              | Auth Required | Roles Allowed               |
| ------ | ------------------ | ------------------------ | ------------- | --------------------------- |
| POST   | `/`                | Create a new course      | Yes           | Instructor, Admin           |
| GET    | `/`                | Get all courses          | Yes           | Student, Instructor, Admin  |
| GET    | `/:id`             | Get course by ID         | Yes           | Student, Instructor, Admin  |
| PATCH  | `/:id`             | Update course            | Yes           | Instructor (owner), Admin   |
| DELETE | `/:id`             | Delete course            | Yes           | Instructor (owner), Admin   |
| POST   | `/:id/enroll`      | Enroll in a course       | Yes           | Student, Instructor, Admin  |
| DELETE | `/:id/unenroll`    | Unenroll from a course   | Yes           | Student, Instructor, Admin  |

### 📝 API Request Examples

#### Register a User

```bash
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "STUDENT"
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "User logged in succesfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "created_at": "2025-12-16T10:30:00.000Z",
    "curses": [],
    "enrollments": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Create a Course (Instructor/Admin only)

```bash
POST /curses
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Introduction to TypeScript",
  "description": "Learn the fundamentals of TypeScript from scratch"
}
```

#### Get All Courses

```bash
GET /curses
Authorization: Bearer <your_jwt_token>
```

#### Enroll in a Course

```bash
POST /curses/1/enroll
Authorization: Bearer <your_jwt_token>
```

#### Update a Course (Owner/Admin only)

```bash
PATCH /curses/1
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Advanced TypeScript Techniques",
  "description": "Deep dive into advanced TypeScript patterns and best practices"
}
```

#### Unenroll from a Course

```bash
DELETE /curses/1/unenroll
Authorization: Bearer <your_jwt_token>
```

#### Delete a Course (Owner/Admin only)

```bash
DELETE /curses/1
Authorization: Bearer <your_jwt_token>
```

### 🗂️ Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── app.controller.ts            # Root controller
├── app.service.ts               # Root service
├── auth/
│   ├── auth.module.ts           # Authentication module
│   ├── auth.controller.ts       # Auth endpoints (register/login)
│   ├── auth.service.ts          # Auth business logic
│   ├── dto/
│   │   └── login.dto.ts         # DTO for user login
│   └── guards/
│       ├── auth.guard.ts        # JWT authentication guard
│       └── role.guard.ts        # Role-based authorization guard
├── users/
│   ├── users.module.ts          # Users module
│   ├── users.controller.ts      # User endpoints
│   ├── users.service.ts         # User business logic
│   ├── entities/
│   │   ├── user.entity.ts       # User entity/model
│   │   └── enrollment.entity.ts # Enrollment entity/model
│   └── dto/
│       ├── create-user.dto.ts   # DTO for creating users
│       ├── update-user.dto.ts   # DTO for updating users
│       └── client-user.dto.ts   # DTO for client user data
├── curses/
│   ├── curses.module.ts         # Courses module
│   ├── curses.controller.ts     # Course endpoints
│   ├── curses.service.ts        # Course business logic
│   ├── entities/
│   │   └── curse.entity.ts      # Course entity/model
│   └── dto/
│       ├── create-curse.dto.ts  # DTO for creating courses
│       └── update-curse.dto.ts  # DTO for updating courses
├── decorators/
│   └── role.decorator.ts        # Custom decorator for roles
└── enums/
    └── roles.enum.ts            # Role enumeration (ADMIN, INSTRUCTOR, STUDENT)
test/
├── app.e2e-spec.ts              # End-to-end tests
└── jest-e2e.json                # E2E test configuration
.env                             # Environment variables
nest-cli.json                    # NestJS CLI configuration
tsconfig.json                    # TypeScript configuration
eslint.config.mjs                # ESLint configuration
package.json                     # Project dependencies
```

### 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login or registration, a token is returned that must be included in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

The token contains user information including their role (ADMIN, INSTRUCTOR, or STUDENT), which is used for authorization decisions.

Token expiration is configured in the [auth.module.ts](src/auth/auth.module.ts) (default: 1 day).

### 📦 Data Models

#### User Entity

```typescript
{
  id: number (auto-generated),
  username: string (required),
  email: string (required, unique),
  password: string (required, hashed, not selected by default),
  role: enum Role (ADMIN | INSTRUCTOR | STUDENT, default: STUDENT),
  created_at: Date (auto-generated),
  curses: Curse[] (one-to-many relationship - courses created by instructor),
  enrollments: Enrollment[] (one-to-many relationship)
}
```

#### Course Entity (Curse)

```typescript
{
  id: number (auto-generated),
  title: string (required),
  description: string (required),
  created_at: Date (auto-generated),
  user_id: number (foreign key - instructor who created it),
  user: User (many-to-one relationship),
  enrollments: Enrollment[] (one-to-many relationship)
}
```

#### Enrollment Entity

```typescript
{
  id: number (auto-generated),
  student: User (many-to-one relationship),
  curse: Curse (many-to-one relationship),
  enrolled_at: Date (auto-generated)
}
```

#### Role Enum

```typescript
enum Role {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}
```

### 🔧 Features

- ✅ User registration and authentication with JWT
- ✅ Three-tier role system (Admin, Instructor, Student)
- ✅ Role-based access control with guards
- ✅ Password hashing with bcrypt
- ✅ RESTful API architecture
- ✅ TypeORM for database operations with MySQL
- ✅ Instructors can create and manage their courses
- ✅ Students can browse and enroll in courses
- ✅ Enrollment/unenrollment system
- ✅ Authorization checks (users can only modify their own data or their courses)
- ✅ DTO validation with class-validator
- ✅ Modular architecture with NestJS
- ✅ TypeScript for type safety
- ✅ Unit and E2E testing setup
- ✅ Code quality tools (ESLint + Prettier)
- ✅ Protected routes with authentication guards
- ✅ Automatic timestamps for data tracking
- ✅ Relational data with enrollments tracking

### 🚀 Deployment

To deploy this application:

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start:prod
```

Make sure to set up your production environment variables and database before deployment.

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

UNLICENSED

### 👤 Author

Boris Espinosa

---

<a name="español"></a>

## 🇪🇸 Español

### 📖 Descripción

Curse Manager API es un servicio backend RESTful construido con NestJS para gestionar cursos en línea e inscripciones de estudiantes. Proporciona una plataforma completa donde los instructores pueden crear y gestionar cursos, los estudiantes pueden inscribirse en cursos disponibles, y los administradores pueden supervisar todo el sistema con control de acceso basado en roles y autenticación segura.

### 🎯 Problema que Resuelve

- **Gestión de Cursos**: Los instructores pueden crear, actualizar y eliminar sus cursos en una plataforma centralizada
- **Inscripciones de Estudiantes**: Los estudiantes pueden explorar cursos disponibles e inscribirse/desinscribirse fácilmente
- **Control de Acceso Basado en Roles**: Sistema de tres niveles de usuarios (Admin, Instructor, Estudiante) con permisos específicos para cada rol
- **Autorización de Usuario**: Solo los creadores de cursos pueden modificar sus cursos; los usuarios solo pueden modificar sus propios perfiles
- **Seguimiento de Inscripciones**: Mantiene un registro completo de todas las inscripciones a cursos con marcas de tiempo
- **Autenticación Segura**: La autenticación basada en JWT asegura la privacidad de datos y el acceso seguro
- **Descubrimiento de Cursos**: Los estudiantes pueden ver todos los cursos disponibles y sus instructores

### 🛠️ Tecnologías Utilizadas

#### Stack Backend

- **NestJS (v11)** - Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables
- **TypeScript (v5.7)** - Lenguaje de programación fuertemente tipado que se construye sobre JavaScript
- **TypeORM (v0.3.27)** - Biblioteca de mapeo objeto-relacional para TypeScript y JavaScript
- **MySQL** - Sistema de gestión de bases de datos relacionales (mysql2 v3.15)
- **JWT (@nestjs/jwt v11)** - Tokens Web JSON para autenticación segura
- **Bcrypt (v6.0)** - Cifrado y hash de contraseñas
- **Class-validator (v0.14)** - Validación basada en decoradores para DTOs
- **Class-transformer (v0.5)** - Transformación y serialización de objetos
- **RxJS (v7.8)** - Biblioteca de programación reactiva
- **Jest (v30)** - Framework de testing
- **ESLint + Prettier** - Linting y formateo de código

### 📋 Prerequisitos

- Node.js (v16 o superior)
- Base de datos MySQL (local o remota)
- Gestor de paquetes npm o yarn

### ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Boris-Espinosa/Curse-Manager-Nest.git
cd Curse-Manager-Nest
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en el directorio raíz:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario_de_base_de_datos
DB_PASSWORD=tu_contraseña_de_base_de_datos
DB_DATABASE=curse_manager

# Configuración JWT
JWT_SECRET=tu_clave_secreta_jwt

# Puerto de la Aplicación
PORT=3000
```

4. Inicia el servidor de desarrollo:

```bash
npm run start:dev
```

### 🚀 Scripts Disponibles

- `npm run start` - Inicia el servidor de producción
- `npm run start:dev` - Inicia el servidor de desarrollo con recarga automática
- `npm run start:debug` - Inicia el servidor en modo debug
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta ESLint para verificar la calidad del código
- `npm run format` - Formatea el código con Prettier
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:cov` - Ejecuta las pruebas con reporte de cobertura
- `npm run test:e2e` - Ejecuta las pruebas end-to-end

### 📡 Endpoints de la API

#### Autenticación (`/auth`)

| Método | Endpoint          | Descripción                | Requiere Auth |
| ------ | ----------------- | ---------------------------- | ------------- |
| POST   | `/auth/register`  | Registrar nuevo usuario      | No            |
| POST   | `/auth/login`     | Iniciar sesión              | No            |

#### Usuarios (`/users`)

| Método | Endpoint       | Descripción                 | Requiere Auth | Roles Permitidos |
| ------ | -------------- | --------------------------- | ------------- | ---------------- |
| POST   | `/`            | Registrar usuario           | No            | -                |
| GET    | `/`            | Obtener todos los usuarios  | No            | -                |
| GET    | `/:email`      | Obtener usuario por email   | No            | -                |
| PATCH  | `/:id`         | Actualizar usuario          | Sí            | Usuario/Admin    |
| DELETE | `/:id`         | Eliminar usuario            | Sí            | Usuario/Admin    |

#### Cursos (`/curses`)

| Método | Endpoint           | Descripción                 | Requiere Auth | Roles Permitidos                |
| ------ | ------------------ | --------------------------- | ------------- | ------------------------------- |
| POST   | `/`                | Crear un nuevo curso        | Sí            | Instructor, Admin               |
| GET    | `/`                | Obtener todos los cursos    | Sí            | Estudiante, Instructor, Admin   |
| GET    | `/:id`             | Obtener curso por ID        | Sí            | Estudiante, Instructor, Admin   |
| PATCH  | `/:id`             | Actualizar curso            | Sí            | Instructor (dueño), Admin      |
| DELETE | `/:id`             | Eliminar curso              | Sí            | Instructor (dueño), Admin      |
| POST   | `/:id/enroll`      | Inscribirse en un curso     | Sí            | Estudiante, Instructor, Admin   |
| DELETE | `/:id/unenroll`    | Desinscribirse de un curso  | Sí            | Estudiante, Instructor, Admin   |

### 📝 Ejemplos de Peticiones a la API

#### Registrar un Usuario

```bash
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "STUDENT"
}
```

#### Iniciar Sesión

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Respuesta:**

```json
{
  "message": "User logged in succesfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "created_at": "2025-12-16T10:30:00.000Z",
    "curses": [],
    "enrollments": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Crear un Curso (Solo Instructor/Admin)

```bash
POST /curses
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "title": "Introducción a TypeScript",
  "description": "Aprende los fundamentos de TypeScript desde cero"
}
```

#### Obtener Todos los Cursos

```bash
GET /curses
Authorization: Bearer <tu_token_jwt>
```

#### Inscribirse en un Curso

```bash
POST /curses/1/enroll
Authorization: Bearer <tu_token_jwt>
```

#### Actualizar un Curso (Solo Dueño/Admin)

```bash
PATCH /curses/1
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "title": "Técnicas Avanzadas de TypeScript",
  "description": "Profundiza en patrones avanzados y mejores prácticas de TypeScript"
}
```

#### Desinscribirse de un Curso

```bash
DELETE /curses/1/unenroll
Authorization: Bearer <tu_token_jwt>
```

#### Eliminar un Curso (Solo Dueño/Admin)

```bash
DELETE /curses/1
Authorization: Bearer <tu_token_jwt>
```

### 🗂️ Estructura del Proyecto

```
src/
├── main.ts                      # Punto de entrada de la aplicación
├── app.module.ts                # Módulo raíz
├── app.controller.ts            # Controlador raíz
├── app.service.ts               # Servicio raíz
├── auth/
│   ├── auth.module.ts           # Módulo de autenticación
│   ├── auth.controller.ts       # Endpoints de auth (register/login)
│   ├── auth.service.ts          # Lógica de negocio de auth
│   ├── dto/
│   │   └── login.dto.ts         # DTO para login de usuario
│   └── guards/
│       ├── auth.guard.ts        # Guard de autenticación JWT
│       └── role.guard.ts        # Guard de autorización por roles
├── users/
│   ├── users.module.ts          # Módulo de usuarios
│   ├── users.controller.ts      # Endpoints de usuarios
│   ├── users.service.ts         # Lógica de negocio de usuarios
│   ├── entities/
│   │   ├── user.entity.ts       # Entidad/modelo de usuario
│   │   └── enrollment.entity.ts # Entidad/modelo de inscripción
│   └── dto/
│       ├── create-user.dto.ts   # DTO para crear usuarios
│       ├── update-user.dto.ts   # DTO para actualizar usuarios
│       └── client-user.dto.ts   # DTO para datos de usuario cliente
├── curses/
│   ├── curses.module.ts         # Módulo de cursos
│   ├── curses.controller.ts     # Endpoints de cursos
│   ├── curses.service.ts        # Lógica de negocio de cursos
│   ├── entities/
│   │   └── curse.entity.ts      # Entidad/modelo de curso
│   └── dto/
│       ├── create-curse.dto.ts  # DTO para crear cursos
│       └── update-curse.dto.ts  # DTO para actualizar cursos
├── decorators/
│   └── role.decorator.ts        # Decorador personalizado para roles
└── enums/
    └── roles.enum.ts            # Enumeración de roles (ADMIN, INSTRUCTOR, STUDENT)
test/
├── app.e2e-spec.ts              # Pruebas end-to-end
└── jest-e2e.json                # Configuración de pruebas E2E
.env                             # Variables de entorno
nest-cli.json                    # Configuración de NestJS CLI
tsconfig.json                    # Configuración de TypeScript
eslint.config.mjs                # Configuración de ESLint
package.json                     # Dependencias del proyecto
```

### 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Después de un inicio de sesión o registro exitoso, se devuelve un token que debe incluirse en el encabezado `Authorization` para rutas protegidas:

```
Authorization: Bearer <tu_token_jwt>
```

El token contiene información del usuario incluyendo su rol (ADMIN, INSTRUCTOR o STUDENT), que se utiliza para decisiones de autorización.

La expiración del token se configura en [auth.module.ts](src/auth/auth.module.ts) (por defecto: 1 día).

### 📦 Modelos de Datos

#### Entidad de Usuario

```typescript
{
  id: number (auto-generado),
  username: string (requerido),
  email: string (requerido, único),
  password: string (requerido, hasheado, no seleccionado por defecto),
  role: enum Role (ADMIN | INSTRUCTOR | STUDENT, por defecto: STUDENT),
  created_at: Date (auto-generado),
  curses: Curse[] (relación uno-a-muchos - cursos creados por el instructor),
  enrollments: Enrollment[] (relación uno-a-muchos)
}
```

#### Entidad de Curso (Curse)

```typescript
{
  id: number (auto-generado),
  title: string (requerido),
  description: string (requerido),
  created_at: Date (auto-generado),
  user_id: number (clave foránea - instructor que lo creó),
  user: User (relación muchos-a-uno),
  enrollments: Enrollment[] (relación uno-a-muchos)
}
```

#### Entidad de Inscripción (Enrollment)

```typescript
{
  id: number (auto-generado),
  student: User (relación muchos-a-uno),
  curse: Curse (relación muchos-a-uno),
  enrolled_at: Date (auto-generado)
}
```

#### Enumeración de Roles

```typescript
enum Role {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}
```

### 🔧 Características

- ✅ Registro y autenticación de usuarios con JWT
- ✅ Sistema de roles de tres niveles (Admin, Instructor, Estudiante)
- ✅ Control de acceso basado en roles con guards
- ✅ Hash de contraseñas con bcrypt
- ✅ Arquitectura API RESTful
- ✅ TypeORM para operaciones de base de datos con MySQL
- ✅ Los instructores pueden crear y gestionar sus cursos
- ✅ Los estudiantes pueden explorar e inscribirse en cursos
- ✅ Sistema de inscripción/desinscripción
- ✅ Verificaciones de autorización (los usuarios solo pueden modificar sus propios datos o sus cursos)
- ✅ Validación de DTOs con class-validator
- ✅ Arquitectura modular con NestJS
- ✅ TypeScript para seguridad de tipos
- ✅ Configuración de pruebas unitarias y E2E
- ✅ Herramientas de calidad de código (ESLint + Prettier)
- ✅ Rutas protegidas con guards de autenticación
- ✅ Marcas de tiempo automáticas para seguimiento de datos
- ✅ Datos relacionales con seguimiento de inscripciones

### 🚀 Despliegue

Para desplegar esta aplicación:

1. Construye el proyecto:

```bash
npm run build
```

2. Inicia el servidor de producción:

```bash
npm run start:prod
```

Asegúrate de configurar tus variables de entorno de producción y base de datos antes del despliegue.

### 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

1. Haz un Fork del proyecto
2. Crea tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Haz commit de tus cambios (`git commit -m 'Agrega una CaracteristicaIncreible'`)
4. Haz push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

### 📄 Licencia

UNLICENSED

### 👤 Autor

Boris Espinosa
