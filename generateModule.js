import { GoogleGenAI, Modality } from '@google/genai';
import * as fs from 'node:fs';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'node:url';

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function generateText(prompt){
  console.log(prompt, 'text');
  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents: prompt
  });
  console.log(response.text);
  return response.text;
}

export async function generateImg(prompt){
  console.log(prompt, 'image');
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  for(const part of response.candidates[0].content.parts){
    if(part.text){
      console.log(part.text);
    }else if(part.inlineData){
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, 'base64');
      writeGeneratedImg(buffer);
      console.log('image saved');
    }
  }
}

function writeGeneratedImg(bin){
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatStr = now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    '.png';
  const imgDir = 'generate/img/';
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, imgDir + formatStr);
  if(!fs.existsSync(imgDir)){
    fs.mkdirSync(imgDir, {recursive: true});
  }
  fs.writeFileSync(filePath, bin);
}
