require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'test';
const { generateImg } = require('./generateModule');

app.use(express.static(path.join(__dirname, 'template')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'index.html'));
});

app.get('/api/img/gen', async(req, res) => {
  try{
    generateImg('ピンクの像を書いて');
  }catch(error){
    console.log(error);
    res.status(500);
  }
})

app.listen(PORT, () => {
  console.log(`${APP_NAME}`);
});
