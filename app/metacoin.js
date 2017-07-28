const fs = require('fs')

var contract
var admin

exports.init = function (web3, owner) {
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

exports.getBalance = function (account) {
  return contract.methods.getBalance(account).call({from: account})
}

exports.sendCoin = function (sender, receiver, value) {
  return new Promise(function (resolve, reject) {
    contract.methods.sendCoin(receiver, value).send({from: sender})
    .then(function (receipt) {
      if (receipt) {
        console.log('transaction receipt', receipt)
        resolve({result: true})
      }
      resolve({result: false})
    }).catch(function (err) {
      return reject(err)
    })
  })
}
