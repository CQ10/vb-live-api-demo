const socketCluster = require('socketcluster-client')

const options = {
  host: 'live.viewblock.io:3001',
  // host: 'localhost:4041',
  autoConnect: true,
  autoReconnect: true,
  autoReconnectOptions: {
    initialDelay: 1e3,
    randomness: 5e3,
    multiplier: 1.1,
    maxDelay: 20e3,
  },
}

module.exports = ({ key, secret, onError = f => f } = {}, onReady) => {
  if (!key) {
    throw new Error('An api key is required.')
  }

  const tss = {}

  const socket = socketCluster.create(options)

  const subscribe = (payload, cb) => {
    const { chain, address, event } = payload
    const key = `${chain}:${address ? `${address}:` : ''}${event}`

    if (tss[key]) {
      socket.emit('backup', { ...payload, ts: tss[key] }, (err, res = []) => {
        res.forEach(cb)
        socket.subscribe(key)
      })

      return
    }

    socket.subscribe(key).watch(data => {
      tss[key] = data.ts
      cb(data)
    })
  }

  socket.on('connect', () => {
    socket.emit('login', { key, secret })
  })

  socket.on('authenticate', () => {
    onReady({ socket, subscribe })
  })

  socket.on('error', onError)
}
