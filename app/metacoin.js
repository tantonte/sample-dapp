const fs = require('fs')

var contract
var admin

function initialize (web3, owner) {
  admin = owner
  // Read the compiled contract code
  var filePath = __dirname + '/../build/contracts/MetaCoin.json'
  let source = fs.readFileSync(filePath)
  let json = JSON.parse(source)

  // ABI description as JSON structure
  var abi = json.abi

  // address of the contract
  var address;
  for(var key in json.networks) {
    if(json.networks.hasOwnProperty(key)) {
        address = json.networks[key].address;
        break;
    }
  }
  console.log(address)

  // init contract object
  contract = new web3.eth.Contract(abi, address, {from: admin, gasPrice: '2000000'})

  if (contract) {
    console.log('successfully create Token contract')
  }
}

function getBalance (account) {
  return contract.methods.getBalance(account).call({from: account})
}

function transfer (sender, receiver, value) {
  return new Promise(function (resolve, reject) {
    contract.methods.sendCoin(receiver, value).send({from: sender})
    .then(function (receipt) {
      if (receipt) {
        console.log('transaction receipt', receipt)
        var balances = {receiver: '', sender: ''}
        getBalance(sender).then(function (balance) {
          balances.sender = balance
          return getBalance(receiver)
        }).then(function (balance) {
          balances.receiver = balance
          return resolve(balances)
        }).catch(function (err) {
          return reject(err)
        })
      }
    }).catch(function (err) {
      return reject(err)
    })
  })
}

module.exports = {
  init: initialize,
  getBalance: getBalance,
  transfer: transfer
}
