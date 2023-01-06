//for(var i = 0;i < process.argv.length; i++){
//    console.log("argv[" + i + "] = " + process.argv[i])
//  }
//use node xxx.js (tileareaNumber)
const config = require('config')

let tileList=[]

if (process.argv[2]){
  if (config.get(`tileList${process.argv[2]}`)){
    tileList = config.get(`tileList${process.argv[2]}`)
  } else {
    console.log('wrong tile area!!!')
  }
} else {
  console.log('Please specify the area. default is all')
  tileList = config.get('tileList1').concat(config.get('tileList2')).concat(config.get('tileList3'))
}

console.log(tileList)

