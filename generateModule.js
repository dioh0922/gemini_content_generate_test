import { GoogleGenAI, Modality } from '@google/genai';
import * as fs from 'node:fs';
import 'dotenv/config';

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function generateText(prompt){
  console.log(prompt, 'text');
  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents: prompt
  });
  console.log(response);
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

  console.log(response);
  for(const part of response.candidates[0].content.parts){
    if(part.text){
      console.log(part.text);
    }else if(part.inlineData){
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync('gemini-generate.png', buffer);
      console.log('image saved');
    }
  }
}
