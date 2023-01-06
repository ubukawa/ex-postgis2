//for(var i = 0;i < process.argv.length; i++){
//    console.log("argv[" + i + "] = " + process.argv[i])
//  }
//use node xxx.js (tileareaNumber)
const config = require('config')
if (process.argv[2]){
  if (config.get(`tileList${process.argv[2]}`)){
    const tileList = config.get(`tileList${process.argv[2]}`)
    console.log(tileList)
  } else {
    console.log('wrong tile area!!!')
  }
} else {
  console.log('Please specify the area')
}

