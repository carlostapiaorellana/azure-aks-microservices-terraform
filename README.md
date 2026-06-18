# IT Support System - Azure Infrastructure & CI/CD

Este repositorio contiene la infraestructura como código (IaC) y la configuración de despliegue para un sistema de soporte técnico, orquestado en Microsoft Azure mediante Terraform.

## Arquitectura

El código automatiza el aprovisionamiento de los siguientes servicios:

* **Azure Kubernetes Service (AKS):** Clúster para la orquestación de contenedores (nodos `Standard_DC2s_v3`).
* **Azure Container Registry (ACR):** Registro privado integrado nativamente con AKS (rol `AcrPull`) para el manejo seguro de imágenes Docker.
* **Azure SQL Database:** Base de datos relacional (`SupportDB` - Tier S0) con firewall configurado para permitir conexiones desde servicios internos de Azure.
* **Azure API Management (APIM):** Capa de Gateway (Tier Consumption) que expone endpoints seguros (`GET`, `POST` en rutas genéricas y `/api/tickets`).
* **NGINX Ingress Controller:** Desplegado mediante el proveedor de Helm directamente desde Terraform para gestionar el enrutamiento de tráfico hacia AKS.

## Requisitos Previos

* Terraform CLI instalado (versiones requeridas: `azurerm ~> 3.0`, `helm ~> 2.0`).
* Cuenta de Azure activa y autenticada (`az login`).
* Configuración previa del backend remoto en Azure (Storage Account `stcarlosv3state` y Resource Group `rg-apppersonal-tfstate` existentes) para almacenar el `tfstate`.

## Despliegue

1. Inicializar el entorno, descargar módulos y proveedores:
   ```bash
   terraform init
   terraforn validate
   terraform plan
   terraform apply --auto-approve