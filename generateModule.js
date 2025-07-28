import { GoogleGenAI, Modality } from '@google/genai';
import * as fs from 'node:fs';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'node:url';
import wav from 'wav';

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function generateText(prompt){
  console.log(prompt, 'text');
  const response = await ai.models.generateContent({
    model:'gemini-2.5-flash',
    contents: prompt
  });
  console.log(response.text);
  return response.text;
}

export async function generateImg(prompt){
  console.log(prompt, 'image');
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: '以下の画像を作って\n' + prompt,
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

export async function generateAudio(prompt){
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{parts: [{text: prompt}]}],
    config:{
      responseModalities:['AUDIO'],
      speechConfig:{
        voiceConfig:{
          prebuiltVoiceConfig:{voiceName: 'Kore'}
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const audioBuffer = Buffer.from(data, 'base64');
  writeGenerateAudio(audioBuffer);
}

function createTimestampStr(){
    const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatStr = now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  return formatStr;
}

function writeGeneratedImg(bin){
  const imgDir = 'generate/img/';
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, imgDir + createTimestampStr() + '.png');
  if(!fs.existsSync(imgDir)){
    fs.mkdirSync(imgDir, {recursive: true});
  }
  fs.writeFileSync(filePath, bin);
  console.log('save', filePath);
}

function writeGenerateAudio(bin){
  const audioDir = 'generate/audio/';
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, audioDir + createTimestampStr() + '.wav');
  if(!fs.existsSync(audioDir)){
    fs.mkdirSync(audioDir, {recursive: true});
  }
  const wavWriter = new wav.FileWriter(filePath, {
    sampleRate: 24000,
    channels: 1,
    bitDepth: 16,
  });
  wavWriter.on('finish', () => {
    console.log('audio fin');
  });
  wavWriter.on('error', (err) => {
    console.log(err);
  });
  wavWriter.write(bin);
  wavWriter.end();

}