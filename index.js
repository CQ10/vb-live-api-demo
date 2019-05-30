const init = require('./core')

init(
  {
    key: 'f7a2a04d3aa238a88db7ed4aa9dda4757e3f8176195066132f458b8b34e18750',
    secret: '7251f0b9555244a3c3158e61c170a2bcbc757d017072be29330a0737ba7aba2e',
  },
  ({ subscribe }) => {
    const subInfo = {
      chain: 'zilliqa',
      address: '11d3cfe90a863245a00cff9d069ffc27585ee764',
      event: 'contractEvent',
    }

    subscribe(subInfo, data => {
      console.log('[ContractEvent]', data)
    })
  },
)
