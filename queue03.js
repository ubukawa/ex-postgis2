//run this as node xxx.js 1
const config = require('config')
const Queue = require('better-queue')

let tileList = []

const shutdown = () =>{
    console.log('System shutdown. Thank you (^o^)/')
}

const q = new Queue(function (input, cb){
    //console.log(`${input} starts: `)//something
    setTimeout(()=>{
        console.log(input)
        /*
        if (input % 5 == 2) {
            console.log(`${input}: failed (test).`)
            cb(true)
        } else{
            console.log(`${input}: wait 3 sec, then OK!`)
            //return cb()
            let rev = input * 3
            //cb(rev)
            cb()  //cb(null, 'computed_id')
            //cb(null, result)
        }
        */
    },3000)
},{concurrent:2, maxRetries:0, retryDelay: 1000})

q.on('task_finish',(result)=>{
    console.log(`${result}:end successfully.`)
})
q.on('task_failed',(err)=>{
    console.log(err)
})
q.on('drain',()=>{
    console.log('Queue drains.')
    shutdown()
})

//for (let i = 0; i <7; i++){
//    q.push(i)
//}


if (process.argv[2]){
    if (config.get(`tileList${process.argv[2]}`)){
      tileList = config.get(`tileList${process.argv[2]}`)
    } else {
      console.log('wrong tile area!!!') // this may not appear because "config" returns error.
    }
  } else {
    console.log('Please specify the area. default is all')
    tileList = config.get('tileListE').concat(config.get('tileList1')).concat(config.get('tileList2')).concat(config.get('tileList3'))
}

for (let moduleKey of tileList){
    q.push(moduleKey)
}

/*
q.push(1)
q.push(2)
q.push(3)
q.push(4)
q.push(5)
*/


