import express from 'express'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import cors from 'cors'
import { videoModel } from './videomodel.js'
import path from 'path'
import bodyParser from 'body-parser'
const app = express()
dotenv.config()
connect(process.env.URI)

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(cors({ origin: ["http://localhost:9099", "https://minicocuk.vercel.app"] }));


app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})


app.get('/download', (req, res) => {
  res.sendfile(path.resolve('./download.html'))
})


app.get('/videos', async (req, res) => {
  const data = await videoModel.find()
  console.log(data);
  return res.status(200).send(data)
})


app.post('/download', async (req, res) => {
  const { title, source } = req.body
  if (title === "" && source === "") res.status(400).send({ success: false, error: err.message })
  await videoModel.create({ title, source })
  return res.sendFile(path.resolve('./index.html'))
})


app.delete('/videos/:_id', async (req, res) => {
  const { _id } = req.params
  await videoModel.findByIdAndDelete(_id)
  return res.sendFile(path.resolve('./index.html'))
})


app.listen(`${process.env.PORT}`, () => console.log(`${process.env.PORT} server qaldırıldı.`))
