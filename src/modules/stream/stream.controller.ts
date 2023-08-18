import { Router } from 'express'
import WebTorrent from 'webtorrent'

const router = Router()
let client = new WebTorrent()

let state = {
  pregress: 0,
  downloadSpeed: 0,
  ratio: 0
}

let error: String

client.on('error', (err: Error) => {
  console.error('err', err.message)
  error = err.message
})

client.on('torrent', () => {
  console.log(client.progress)

  state = {
    pregress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  }
})

router.get('/add/:magnet', (req, res) => {
  const magnet = req.params.magnet

  client.add(magnet, torrent => {
    console.log(torrent.files)

    const files = torrent.files.map(data => ({
      name: data.name,
      length: data.length
    }))
    res.status(200).send(files)
  })
})

router.get('/stats', (req, res) => {
  state = {
    pregress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  }
  res.status(200).send(state)
})

export default router

// 2C3240D7EBC9704101F219777E29F4E620C1E5E3
