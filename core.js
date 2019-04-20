const socketCluster = require('socketcluster-client')

const options = {
  host: 'live.viewblock.io:3001',
  autoConnect: true,
  autoReconnect: true,
  autoReconnectOptions: {
    initialDelay: 10e3,
    randomness: 10e3,
    multiplier: 1.5,
    maxDelay: 60e3,
  },
}

const addPrefix = str => (str.startsWith('0x') ? str : `0x${str}`)

module.exports = ({ key, secret, onError = f => f } = {}) => {
  if (!key) {
    throw new Error('An api key is required.')
  }

  const socket = socketCluster.create(options)

  socket.emit('login', { key, secret })

  socket.on('error', onError)

  return {
    socket,
    subscribe: ({ chain, address, event }, cb) => {
      const key = `${chain}:${address ? `${addPrefix(address)}:` : ''}${event}`
      socket.subscribe(key).watch(cb)
    },
  }
}
