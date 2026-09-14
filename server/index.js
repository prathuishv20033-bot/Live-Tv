import express from 'express';
import cors from 'cors';
import { Client } from '@mtkruto/node';
import dotenv from 'dotenv';

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const botToken = process.env.BOT_TOKEN;

const client = new Client({ apiId, apiHash });

const app = express();
app.use(cors());
app.use(express.json());

async function initTelegram() {
  console.log('Connecting to Telegram via MTKruto...');
  await client.start({ botToken: botToken });
  console.log('Telegram Bot Connected Successfully via MTKruto!');
  
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`MTKruto Streamer Backend running on http://localhost:${PORT}`);
  });
}

initTelegram();

app.get('/stream', async (req, res) => {
  console.log(`Received request for /stream, Range: ${req.headers.range}`);
  const { channelId, msgId } = req.query;

  if (!channelId || !msgId) {
    return res.status(400).send('channelId and msgId are required');
  }

  try {
    const message = await client.getMessage(Number(channelId), parseInt(msgId));

    if (!message || !message.document) {
      return res.status(404).send('Media not found. Ensure the bot is an admin in the channel and the msgId is correct.');
    }

    const document = message.document;
    const fileSize = Number(document.fileSize);

    const range = req.headers.range;
    let start = 0;
    let end = fileSize - 1;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
    }

    let bytesSent = 0;
    const chunksize = (end - start) + 1;
    
    // Telegram API requires offset to be a multiple of 4096
    const alignedOffset = start - (start % 4096);
    const skipBytes = start - alignedOffset;
    let isFirstChunk = true;

    for await (let chunk of client.download(document.fileId, { offset: alignedOffset })) {
      if (res.closed) break;
      
      if (isFirstChunk) {
        if (skipBytes > 0) {
          chunk = chunk.slice(skipBytes);
        }
        isFirstChunk = false;
      }
      
      const bytesToProcess = chunk.length;
      if (bytesSent + bytesToProcess > chunksize) {
        const remaining = chunksize - bytesSent;
        res.write(chunk.slice(0, remaining));
        break;
      } else {
        const canWrite = res.write(chunk);
        bytesSent += bytesToProcess;
        if (!canWrite) {
          await new Promise(resolve => res.once('drain', resolve));
        }
      }
    }
    res.end();

  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
});
