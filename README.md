# Orquestación de Microservicios en Azure Kubernetes Service (AKS) con APIM, SQL Server y Terraform

Proyecto de infraestructura como código (IaC) y automatización CI/CD para el aprovisionamiento automatizado de una arquitectura completa en Microsoft Azure: clúster de Kubernetes (AKS), API Management (APIM), base de datos Azure SQL, registro privado (ACR) e Ingress NGINX vía Helm.

<img width="2814" height="1536" alt="Arquitectura_AZURE" src="https://github.com/user-attachments/assets/e3db7218-fed1-40d1-bfd0-20eb3da8492f" />


---

## Arquitectura y Recursos Provisionados (Terraform)

- **Cómputo y Orquestación:** Azure Kubernetes Service (AKS) con nodos `Standard_DC2s_v3` e identidad asignada por el sistema (`SystemAssigned`).
- **Controlador de Ingress:** Ingress NGINX instalado dentro del clúster mediante el proveedor oficial de Helm (`helm_release`).
- **Exposición de APIs:** Azure API Management (APIM SKU Consumption) configurado con la API `tickets-api` y operaciones REST (`GET /api/tickets`, `POST /api/tickets` y comodín `/{*path}`).
- **Base de Datos:** Azure SQL Server y Azure SQL Database (`SupportDB`, SKU S0) con regla de firewall `AllowAzureServices` habilitada para la comunicación desde AKS.
- **Registro de Contenedores:** Azure Container Registry (ACR, SKU Basic) integrado a AKS mediante la asignación del rol `AcrPull`.
- **Estado Remoto (Backend):** Estado de Terraform respaldado en Azure Blob Storage (`rg-apppersonal-tfstate` / `stcarlosv3state`).

---

## Estructura del Repositorio

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml      # Pipeline CI/CD para build, push y rollout
├── app/
│   ├── public/             # Interfaz pública
│   ├── Dockerfile          # Imagen de la aplicación
│   ├── package.json        # Dependencias de Node.js
│   └── server.js           # Servidor de API / backend
├── k8s/
│   ├── deployment.yaml     # Configuración de Pods
│   ├── ingress.yaml        # Reglas de enrutamiento Kubernetes
│   └── service.yaml        # Servicio interno
├── main.tf                 # Código principal de Terraform (AKS, APIM, SQL, ACR, Helm)
├── outputs.tf              # Salidas de infraestructura
├── variables.tf            # Variables del proyecto
└── README.md
```

---

## Guía de Ejecución

### Prerrequisitos
- Azure CLI (`az`) instalado y autenticado (`az login`).
- Terraform >= 1.5.0.
- `kubectl` e `helm` instalados.

---

### 1. Despliegue de Infraestructura (Terraform + Helm)

**Paso 1.1: Inicializar el proyecto y conectar con el backend en Azure Blob Storage**
```bash
terraform init
```

**Paso 1.2: Revisar la ejecución planificada**
```bash
terraform plan
```

**Paso 1.3: Aprovisionar los recursos en Azure e instalar Ingress NGINX vía Helm**
```bash
terraform apply -auto-approve
```

---

### 2. Configuración de Acceso al Clúster AKS

**Paso 2.1: Obtener credenciales de kubectl desde Azure**
```bash
az aks get-credentials --resource-group <NOMBRE-RESOURCE-GROUP> --name aks-tickets
```

**Paso 2.2: Verificar los nodos activos en el clúster**
```bash
kubectl get nodes
```

**Paso 2.3: Verificar el estado del Ingress Controller desplegado por Helm**
```bash
kubectl get pods -n ingress-basic
```

---

### 3. Despliegue de Manifiestos en Kubernetes

**Paso 3.1: Aplicar los manifiestos de la aplicación**
```bash
kubectl apply -f k8s/
```

**Paso 3.2: Confirmar el estado de los servicios y Pods**
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

### 4. Ejecución vía Pipeline CI/CD (GitHub Actions)

El workflow `.github/workflows/deploy.yml` ejecuta los siguientes pasos en cada despliegue:
1. Construcción de la imagen Docker de la aplicación ubicada en `app/`.
2. Push de la imagen autenticada hacia Azure Container Registry (ACR).
3. Rollout de los manifiestos de la carpeta `k8s/` hacia el clúster AKS.

---

### 5. Limpieza y Destrucción de Recursos

Para eliminar todos los recursos creados en Azure (incluyendo APIM, SQL Server, AKS y ACR) y evitar cargos adicionales:
```bash
terraform destroy -auto-approve
```

---

## Autor

- **Carlos Tapia Orellana**
- **LinkedIn:** [linkedin.com/in/carlostapiao](https://www.linkedin.com/in/carlostapiao/)
- **Correo:** carlostapiat3csup32@gmail.com
