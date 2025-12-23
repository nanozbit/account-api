# Backend Application - NestJS + MySQL

Aplicación backend con NestJS y MySQL que soporta múltiples ambientes (DEV y PROD).

## 📋 Características

- ✅ Endpoint `GET /health` - Health check
- ✅ Endpoint `GET /info` - Obtiene información desde MySQL
- ✅ Configuración por variables de entorno
- ✅ Soporte para múltiples ambientes (DEV/PROD)
- ✅ Dockerizado con multi-stage builds
- ✅ Docker Compose para desarrollo local

## 🛠️ Tecnologías

- **Backend**: NestJS 10.x
- **Base de Datos**: MySQL 8.0
- **ORM**: TypeORM
- **Contenedores**: Docker & Docker Compose

## 📁 Estructura del Proyecto

```
.
├── src/
│   ├── entities/
│   │   └── info.entity.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── init-db/
│   ├── dev/
│   │   └── 01-init.sql
│   └── prod/
│       └── 01-init.sql
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.dev
├── .env.prod
└── README.md
```

## 🚀 Ejecución Local

### Requisitos Previos

- Docker 20.x o superior
- Docker Compose 2.x o superior
- Node.js 18.x (opcional, para desarrollo)

### Opción 1: Usando Docker Compose (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd nestjs-backend-app
```

2. **Crear la estructura de directorios para inicialización**
```bash
mkdir -p init-db/dev init-db/prod
```

3. **Levantar todos los servicios**
```bash
docker-compose up -d
```

Esto levantará:
- `mysql-dev` en puerto 3306
- `mysql-prod` en puerto 3307
- `app-dev` en puerto 8080
- `app-prod` en puerto 8081

4. **Verificar que los servicios están corriendo**
```bash
docker-compose ps
```

5. **Probar los endpoints**

**Ambiente DEV:**
```bash
# Health check
curl http://localhost:8080/health

# Info desde base de datos
curl http://localhost:8080/info
```

**Ambiente PROD:**
```bash
# Health check
curl http://localhost:8081/health

# Info desde base de datos
curl http://localhost:8081/info
```

6. **Ver logs**
```bash
# Todos los servicios
docker-compose logs -f

# Solo app-dev
docker-compose logs -f app-dev

# Solo app-prod
docker-compose logs -f app-prod
```

7. **Detener los servicios**
```bash
docker-compose down
```

8. **Detener y eliminar volúmenes (datos de BD)**
```bash
docker-compose down -v
```

### Opción 2: Build y Run Manual con Docker

1. **Construir la imagen**
```bash
docker build -t app-example .
```

2. **Ejecutar contenedor DEV**
```bash
docker run -p 8080:8080 \
  -e APP_ENV=dev \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=app_dev \
  -e DB_USER=devuser \
  -e DB_PASSWORD=devpassword \
  app-example
```

3. **Ejecutar contenedor PROD**
```bash
docker run -p 8081:8080 \
  -e APP_ENV=prod \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3307 \
  -e DB_NAME=app_prod \
  -e DB_USER=produser \
  -e DB_PASSWORD=prodpassword \
  app-example
```

**Nota**: `host.docker.internal` permite al contenedor conectarse a servicios en el host.

### Opción 3: Desarrollo Local (Sin Docker)

1. **Instalar dependencias**
```bash
npm install
```

2. **Levantar solo las bases de datos con Docker**
```bash
docker-compose up mysql-dev mysql-prod -d
```

3. **Configurar variables de entorno**
```bash
# Para DEV
export $(cat .env.dev | xargs)

# O para PROD
export $(cat .env.prod | xargs)
```

4. **Ejecutar en modo desarrollo**
```bash
npm run start:dev
```

5. **Ejecutar en modo producción**
```bash
npm run build
npm run start:prod
```

## 🔌 Endpoints de la API

### GET /health

Verifica el estado de la aplicación.

**Request:**
```bash
curl http://localhost:8080/health
```

**Response:**
```json
{
  "status": "ok"
}
```

### GET /info

Obtiene información desde la base de datos del ambiente actual.

**Request:**
```bash
curl http://localhost:8080/info
```

**Response DEV:**
```json
{
  "message": "Development environment is ready!",
  "environment": "dev",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response PROD:**
```json
{
  "message": "Production environment is live!",
  "environment": "prod",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo | Default |
|----------|-------------|---------|---------|
| `APP_ENV` | Ambiente de ejecución | `dev` o `prod` | `dev` |
| `PORT` | Puerto de la aplicación | `8080` | `8080` |
| `DB_HOST` | Host de MySQL | `mysql-dev` | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` | `3306` |
| `DB_NAME` | Nombre de la base de datos | `app_dev` | `app_dev` |
| `DB_USER` | Usuario de MySQL | `devuser` | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `devpassword` | `password` |

## 🗄️ Configuración de Base de Datos

### Estructura de la Tabla

```sql
CREATE TABLE info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message VARCHAR(255) NOT NULL
);
```

### Datos de Ejemplo

**DEV:**
```sql
INSERT INTO info (message) VALUES ('Hello from DEV');
INSERT INTO info (message) VALUES ('Development environment is ready!');
```

**PROD:**
```sql
INSERT INTO info (message) VALUES ('Hello from PROD');
INSERT INTO info (message) VALUES ('Production environment is live!');
```

## ☁️ Configuración para GCP Cloud SQL

### Crear Instancia de Cloud SQL

1. **Crear instancia con IP privada**
```bash
gcloud sql instances create mysql-instance \
  --database-version=MYSQL_8_0 \
  --tier=db-n1-standard-1 \
  --region=us-central1 \
  --network=projects/[PROJECT_ID]/global/networks/default \
  --no-assign-ip
```

2. **Crear bases de datos**
```bash
# Base de datos DEV
gcloud sql databases create app_dev --instance=mysql-instance

# Base de datos PROD
gcloud sql databases create app_prod --instance=mysql-instance
```

3. **Crear usuarios**
```bash
# Usuario DEV
gcloud sql users create devuser \
  --instance=mysql-instance \
  --password=SECURE_PASSWORD_DEV

# Usuario PROD
gcloud sql users create produser \
  --instance=mysql-instance \
  --password=SECURE_PASSWORD_PROD
```

4. **Conectarse y ejecutar scripts de inicialización**
```bash
# Conectar vía Cloud SQL Proxy
cloud_sql_proxy -instances=[PROJECT_ID]:[REGION]:mysql-instance=tcp:3306

# Ejecutar scripts
mysql -h 127.0.0.1 -u devuser -p app_dev < init-db/dev/01-init.sql
mysql -h 127.0.0.1 -u produser -p app_prod < init-db/prod/01-init.sql
```

### Desplegar en GCP

1. **Build y push de la imagen**
```bash
# Build
docker build -t gcr.io/[PROJECT_ID]/app-example:latest .

# Push a Container Registry
docker push gcr.io/[PROJECT_ID]/app-example:latest
```

2. **Desplegar en Cloud Run (ejemplo)**
```bash
# Ambiente DEV
gcloud run deploy app-dev \
  --image gcr.io/[PROJECT_ID]/app-example:latest \
  --set-env-vars APP_ENV=dev,DB_HOST=[PRIVATE_IP],DB_NAME=app_dev,DB_USER=devuser,DB_PASSWORD=[PASSWORD] \
  --region us-central1 \
  --vpc-connector [VPC_CONNECTOR]

# Ambiente PROD
gcloud run deploy app-prod \
  --image gcr.io/[PROJECT_ID]/app-example:latest \
  --set-env-vars APP_ENV=prod,DB_HOST=[PRIVATE_IP],DB_NAME=app_prod,DB_USER=produser,DB_PASSWORD=[PASSWORD] \
  --region us-central1 \
  --vpc-connector [VPC_CONNECTOR]
```

## 🔍 Troubleshooting

### La aplicación no se conecta a MySQL

1. Verificar que MySQL esté corriendo:
```bash
docker-compose ps mysql-dev
```

2. Verificar logs de MySQL:
```bash
docker-compose logs mysql-dev
```

3. Verificar conectividad desde el contenedor de la app:
```bash
docker-compose exec app-dev sh
ping mysql-dev
```

### Error "Can't connect to MySQL server"

- Asegúrate de que el host sea correcto (`mysql-dev` en Docker Compose)
- Verifica que las credenciales sean correctas
- Espera a que MySQL termine de inicializarse (puede tomar 30-60 segundos)

### Los datos no aparecen

1. Verificar que los scripts de inicialización se ejecutaron:
```bash
docker-compose exec mysql-dev mysql -u devuser -pdevpassword app_dev -e "SELECT * FROM info;"
```

2. Si no hay datos, ejecutar manualmente:
```bash
docker-compose exec mysql-dev mysql -u devuser -pdevpassword app_dev < init-db/dev/01-init.sql
```

## 📝 Notas de Seguridad

- **NO** usar las contraseñas de ejemplo en producción
- Usar **secretos** para almacenar credenciales (GCP Secret Manager, Kubernetes Secrets, etc.)
- Rotar credenciales regularmente
- Usar **Cloud SQL Auth Proxy** para conexiones seguras en GCP
- Implementar **firewall rules** apropiadas
- Habilitar **SSL/TLS** para conexiones de base de datos

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [GCP Cloud SQL Documentation](https://cloud.google.com/sql/docs)

## 📄 Licencia

MIT