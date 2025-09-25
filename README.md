# Gemini Image App

Una aplicación web construida con React, Vite y TypeScript que utiliza la API de Google Gemini para realizar una variedad de tareas de análisis y generación de texto relacionadas con imágenes.

## Funcionalidades

### Funciones Gratuitas
- **Analizar Imagen:** Sube una imagen y la IA genera un prompt descriptivo.
- **Mejorar Prompt:** Refina un prompt simple para obtener mejores resultados.
- **Variaciones (Pro):** A partir de una idea simple, genera 5 variaciones de prompts creativos usando el modelo `gemini-2.5-pro`.
- **Paleta de Colores:** Extrae la paleta de colores dominantes de una imagen y muestra sus códigos HEX.
- **Lluvia de Ideas:** Genera una lista de conceptos categorizados a partir de una sola palabra clave.
- **Narrador de Imágenes:** Crea un poema o un micro-relato inspirado en una imagen.

### Funciones Premium (Requieren Plan de Pago)
- **Editar Imagen:** Modifica una imagen existente a partir de una instrucción de texto.
- **Crear Imagen:** Genera una imagen desde cero a partir de un prompt.

## Configuración

Para que la aplicación funcione, necesitas proporcionar tu propia clave de API de Google Gemini.

1.  En la raíz del proyecto, busca el archivo llamado `.env.example`.
2.  Haz una copia de este archivo y renómbrala a `.env`.
3.  Abre el nuevo archivo `.env` y reemplaza el marcador de posición `YOUR_API_KEY_HERE` con tu clave de API real.

El archivo `.env` está incluido en el `.gitignore`, por lo que tu clave secreta nunca se subirá a GitHub.

## Cómo Empezar

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo:**
    Puedes usar el script que creamos:
    ```bash
    # Simplemente haz doble clic en el archivo start-dev.bat en Windows
    ```
    O ejecutar el comando manualmente:
    ```bash
    npm run dev
    ```

3.  Abre la URL local (normalmente `http://localhost:5173`) en tu navegador.