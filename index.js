const init = require('./core')

const { socket, subscribe } = init({
  key: '',
  secret: '',
})

socket.on('connect', () => {
  console.log('[Connected]')
})

socket.on('authenticate', () => {
  console.log('[Authenticated]')

  subscribe(
    {
      chain: 'zilliqa',
      address: '11d3cfe90a863245a00cff9d069ffc27585ee764',
      event: 'contractEvent',
    },
    data => {
      console.log('[ContractEvent]', data)
    },
  )
})
