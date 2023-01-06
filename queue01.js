const Queue = require('better-queue')

const q = new Queue(function (input, cb){
    console.log(`${input} starts:`)//something
    setTimeout(()=>{
        if (input % 4 == 2) {
            console.log(`${input}: failed (test).`)
            cb(true)
        } else{
            console.log(`${input}: wait 3 sec, then OK!`)
            //return cb()
            //cb(null,result)
            cb()
        }
    },3000)
    //if (input % 5 == 1){
    //    //cb(true)
    //    cb(null, result)
    //} else {
    //    return cb()
    //}
    //cb(null, result)
},{concurrent:2, maxRetries:3, retryDelay: 1000})


//for (let i = 0; i <7; i++){
//    q.push(i)
//}

q.push(1)
q.push(2)
q.push(3)
q.push(4)
q.push(5)
