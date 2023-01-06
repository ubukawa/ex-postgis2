const config = require('config')
const Queue = require('better-queue')

let tileList = []

if (process.argv[2]){
    if (config.get(`tileList${process.argv[2]}`)){
      tileList = config.get(`tileList${process.argv[2]}`)
    } else { // this may not appear because "config" returns error.
      console.log('wrong tile area!!!') 
    }
  } else {
    console.log('Please specify the area. default is all')
    tileList = config.get('tileListE').concat(config.get('tileList1')).concat(config.get('tileList2')).concat(config.get('tileList3'))
}

/*
console.log(tileList)
for (let moduleKey of tileList){
    console.log(moduleKey)
}
*/


const q = new Queue(function (input,cb) {
    console.log(`${input}: started!`)
    setTimeout(()=>{
        console.log(`${input}: end!`)
        cb()
    },2000)
},{concurrent:3, maxRetries:2,retryDelay:1000})

for (let key of tileList){
    //console.log(key)
    q.push(key)
}

