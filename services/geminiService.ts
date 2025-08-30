import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { Message, ParsedGeminiResponse, Source, AnalysisSection } from '../types';
import { SYSTEM_PROMPT } from '../constants';

// FIX: Enforce API_KEY presence and use it for initialization, throwing an error if it's missing.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("A variável de ambiente API_KEY não está definida. As funcionalidades de IA não funcionarão.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseGeminiResponse = (response: GenerateContentResponse): ParsedGeminiResponse => {
    const rawText = response.text;
    const sources: Source[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
    })) || [];

    const sections: AnalysisSection[] = [];
    const sectionHeaders = [
        "Análise do Fim",
        "Meios e Custos de Oportunidade",
        "Consequências (Esperadas e Inesperadas)",
        "Sugestão de Avaliação"
    ];

    let remainingText = rawText;

    sectionHeaders.forEach((header, index) => {
        const nextHeader = sectionHeaders[index + 1];
        const headerPattern = `### ${header}`;
        
        const startIndex = remainingText.indexOf(headerPattern);
        if (startIndex === -1) return;

        let endIndex;
        if (nextHeader) {
            endIndex = remainingText.indexOf(`### ${nextHeader}`, startIndex);
        }
        
        const sectionBlock = endIndex === -1 || !nextHeader ? remainingText.substring(startIndex) : remainingText.substring(startIndex, endIndex);
        
        const content = sectionBlock.replace(headerPattern, "").trim();

        if (content) {
            sections.push({
                id: uuidv4(),
                title: header,
                content: content,
            });
        }
    });

    // If parsing fails, return the whole text as a single section
    if (sections.length === 0 && rawText) {
        sections.push({
            id: uuidv4(),
            title: "Análise Geral",
            content: rawText,
        });
    }

    return { sections, sources };
};


class GeminiService {
  async generateResponse(messages: Message[]): Promise<ParsedGeminiResponse> {
    try {
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: typeof msg.content === 'string' ? msg.content : "Análise anterior" }] as Part[],
        }));
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ googleSearch: {} }],
            },
        });

      return parseGeminiResponse(response);
    } catch (error) {
      console.error("Error generating response from Gemini:", error);
      throw new Error("Falha ao obter uma resposta da IA.");
    }
  }
}

export const geminiService = new GeminiService();