require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'test';
const { generateImg, generateText } = require('./generateModule');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'template')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

app.get('/img', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'image.html'));
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
  }catch{
    console.log(error);
    res.status(500);
  }
});

app.listen(PORT, () => {
  console.log(`${APP_NAME}`);
});
