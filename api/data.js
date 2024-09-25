import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const filePath = path.join(process.cwd(), 'db.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    console.log(data);

    if (req.method === 'GET') {
        // `GET` isteği: Tüm videoları döndür
        res.status(200).json(data.videos);
    } else if (req.method === 'POST') {
        // `POST` isteği: Yeni video ekle
        const newVideo = req.body;

        // Yeni video id'si oluştur
        const newId = data.videos.length > 0 ? data.videos[data.videos.length - 1].id + 1 : 1;
        newVideo.id = newId;

        // Yeni videoyu listeye ekle
        data.videos.push(newVideo);

        // Güncellenmiş veriyi `db.json` dosyasına yaz
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        res.status(201).json(newVideo);  // Yeni videoyu döndür
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
