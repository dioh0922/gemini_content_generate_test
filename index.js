require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'test';
const { generateImg, generateText, generateVoice } = require('./generateModule');

app.use(express.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'template')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'template'));
app.use('/generate', express.static('generate'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

app.get('/img', (req, res, next) => {
  const imageDir = path.join(__dirname, 'generate/img');
  fs.readdir(imageDir, (err, files) => {
    if(err){
      console.log(err);
      return next(err);
    }
    const imageFiles = files.filter(file => ['.png'].includes(path.extname(file).toLowerCase()));
    res.render('image.html', {images: imageFiles});
  });
});

app.get('/voice', (req, res) => {
  const voiceDir = path.join(__dirname, 'generate/audio/voice');
    fs.readdir(voiceDir, (err, files) => {
    if(err){
      console.log(err);
      return next(err);
    }
    const voiceFiles = files.filter(file => ['.wav'].includes(path.extname(file).toLowerCase()));
    res.render('voice.html', {voices: voiceFiles});
  });
});

app.get('/api/text/gen', async(req, res) => {
  try{
    res.send({text: await generateText('テスト')});
  }catch(error){
    console.log(error);
    res.status(500);
  }
});

app.get('/api/img/gen', async(req, res) => {
  try{
    generateImg('ピンクの像を書いて');
    res.send({result: 1});
  }catch(error){
    console.log(error);
    res.status(500);
  }
});

app.post('/api/img/gen', async(req, res) => {
  try{
    const member = req.body;
    generateImg(member.prompt);
    res.send({result: 1});
  }catch(error){
    console.log(error);
    res.status(500);
  }
});

app.get('/api/voice/gen', async(req, res) => {
  try{
    generateVoice('女性: テスト音声です');
    res.send({result: 1});
  }catch(error){
    console.log(error);
    res.status(500);
  }
});

app.post('/api/voice/gen', async(req, res) => {
  try{
    const member = req.body;
    generateVoice(member.prompt);
    res.send({result: 1});
  }catch(error){
    console.log(error);
    res.status(500);
  }
});

app.listen(PORT, () => {
  console.log(`${APP_NAME}`);
});
