import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import cors from 'cors';
import { videoModel } from './videomodel.js';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();
connect(process.env.URI);

// ES Modules için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(cors({ origin: ["http://localhost:9099", "https://minicocuk.vercel.app"] }));

// Statik dosyaları 'public' klasöründen sunmak
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa ve diğer HTML dosyalarını yönlendirmek
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'download.html'));
});

// API endpoint'i: Videoları almak
app.get('/api/videos', async (req, res) => {
  const data = await videoModel.find();
  console.log(data);
  return res.status(200).send(data);
});

// Video yükleme işlemi
app.post('/api/downloadvideo', async (req, res) => {
  const { title, source } = req.body;
  if (!title || !source) {
    return res.status(400).send({ success: false, error: 'Title and source are required.' });
  }
  await videoModel.create({ title, source });
  return res.redirect('/');
});

// Video silme işlemi
app.delete('/api/videos/:_id', async (req, res) => {
  const { _id } = req.params;
  await videoModel.findByIdAndDelete(_id);
  return res.redirect('/');
});

// Sunucuyu dinlemeye başlama
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
