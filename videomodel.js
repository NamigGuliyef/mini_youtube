import { model, Schema } from "mongoose"

const Video = new Schema({
  title: { type: String },
  source: { type: String }
}, { versionKey: false, timestamps: true })

export const videoModel = model("video", Video)
