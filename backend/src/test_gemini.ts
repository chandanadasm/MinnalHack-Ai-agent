import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key Loaded:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with a simple JSON object containing {"hello": "world"}',
      config: {
        responseMimeType: 'application/json',
      }
    });
    console.log('Response Text:', response.text);
  } catch (error) {
    console.error('Error querying Gemini:', error);
  }
}

run();
