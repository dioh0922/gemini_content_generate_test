import { GoogleGenAI, Modality } from '@google/genai';
import * as fs from 'node:fs';
import 'dotenv/config';
export async function generateImg(prompt){
  console.log(prompt);
  const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
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
