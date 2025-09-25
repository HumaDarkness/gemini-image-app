
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY not found. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: base64EncodedData, mimeType: file.type },
  };
}

// --- API Service Functions ---

export const analyzeImage = async (imageFile: File): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const imagePart = await fileToGenerativePart(imageFile);
  
  const prompt = "Genera un prompt detallado para un generador de imágenes a partir de lo que ves. Tu respuesta debe estar en español, ser muy descriptiva, capturar la atmósfera, los objetos, los colores y el estilo. Empieza directamente con la descripción; no incluyas ninguna frase introductoria. Importante: si en la imagen aparece una persona, no describas sus rasgos físicos. En su lugar, para referirte a la persona, utiliza únicamente la frase 'la imagen que te acabo de subir'.";

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
};

export const improvePrompt = async (prompt: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const fullPrompt = `Eres un experto en la creación de prompts para modelos de generación de imágenes. Refina y enriquece el siguiente prompt para que produzca resultados más vívidos y artísticamente interesantes. Mantén el idioma original (español). No añadas introducciones ni conclusiones, solo devuelve el prompt mejorado. Prompt a mejorar: "${prompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};


export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });
    const imagePart = await fileToGenerativePart(imageFile);

    const fullPrompt = `Realiza la siguiente edición a la imagen que te he proporcionado. Es muy importante que mantengas el estilo y la composición general de la imagen original, modificando únicamente lo que te pido a continuación. No cambies al sujeto, el fondo o la iluminación a menos que la instrucción sea específicamente sobre eso. La edición es: "${prompt}"`;

    const result = await model.generateContent([fullPrompt, imagePart]);
    const response = await result.response;

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error("La IA no generó una imagen válida.");
};

export const createImage = async (prompt: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error("La IA no generó una imagen válida.");
};

export const generatePromptVariations = async (simplePrompt: string): Promise<string[]> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const fullPrompt = `Eres un experto en la creación de prompts para modelos de generación de imágenes. A partir de la siguiente idea simple, genera una lista de 5 prompts creativos, detallados y diversos. Cada prompt debe ser único y explorar diferentes estilos artísticos, composiciones o atmósferas. Devuelve únicamente la lista de prompts, cada uno en una nueva línea, empezando con un número seguido de un punto (ej: "1. ..."). No incluyas ningún otro texto, título o introducción.

Idea simple: "${simplePrompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Split the response into an array of prompts
    // This assumes the AI follows the instruction to return a numbered list.
    return text.split(/\n\d+\.\s*/).filter(p => p.trim().length > 0);
};

export interface ColorInfo {
  name: string;
  hex: string;
}

export const analyzeColorPalette = async (imageFile: File): Promise<ColorInfo[]> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = "Analiza la paleta de colores de esta imagen. Identifica los 6 colores más dominantes. Proporciona tu respuesta como un array de objetos JSON válido. Cada objeto debe tener dos claves: \"name\" (un nombre descriptivo para el color en español) y \"hex\" (el código hexadecimal del color). No proporciones ningún otro texto, explicación o formato que no sea el array JSON puro.";

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's a valid JSON array
    const jsonString = text.replace(/```json|```/g, '').trim();

    try {
        const palette = JSON.parse(jsonString);
        return palette;
    } catch (e) {
        console.error("Failed to parse color palette JSON:", e);
        throw new Error("La IA no devolvió una paleta de colores válida.");
    }
};

export const brainstormIdeas = async (keyword: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Eres un asistente creativo experto en brainstorming para artistas. A partir de la siguiente palabra clave, genera una lista de conceptos e ideas para ayudar a crear un prompt de IA generativa. Estructura tu respuesta usando Markdown. Usa los siguientes encabezados exactamente: ### Estilos, ### Entornos, ### Acciones, ### Objetos. Debajo de cada encabezado, proporciona una lista de 5 a 7 ideas separadas por comas.

Palabra clave: "${keyword}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

export const narrateImage = async (imageFile: File, format: 'poem' | 'story'): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `Eres un escritor creativo. Observa la atmósfera, los personajes y el entorno de esta imagen. Escribe un ${format === 'poem' ? 'poema corto y evocador' : 'micro-relato de no más de 150 palabras'} inspirado en ella. Tu respuesta debe ser únicamente el texto creativo.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
};

