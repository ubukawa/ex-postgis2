//run this as node xxx.js 1
const config = require('config')
const Queue = require('better-queue')
const { Pool, Query } = require('pg')

// config constants (connection should be read when needed)
const relations = config.get('relations')
const outputDir = config.get('outputDir')

let idle = true
let tileList = []
let pools = {}
//let modulekeysInProgress = []

//A function to return time in ISO
const iso = () => {
    return (new Date()).toISOString()
}

const isIdle = () => {
    return idle
}

const sleep = (wait) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, wait)
    })
}

//const postGISaccess = async (key, relation) =>{
const postGISaccess = async (key, relation, downstream) =>{
    return new Promise((resolve,reject) => {
        const statrTime = new Date()
        const [database, schema, view] = relation.split('::')
        if(!pools[database]){
            pools[database] = new Pool({
                host: config.get(`connection.${database}.host`),
                user: config.get(`connection.${database}.dbUser`),
                port: config.get(`connection.${database}.port`),
                password: config.get(`connection.${database}.dbPassword`),
                database: database
            })
        }
        pools[database].connect(async (err,client,release) => {
            if (err) throw err
            let sql = `SELECT column_name FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${view}' ORDER BY ordinal_position`
            let res = client.query(sql)
            let sql2 = `SELECT count(*) FROM ${schema}.${view}`
            let res2 = await client.query(sql2)
            console.log(`-------------------\n${database}::${schema}::${view}:\n - has ${res2} records. \n - has the following columns:\n ${res}`)
            await client.end()
            //await client.query(`COMMIT`)
            release()
            resolve()
        })
    }
    )
}



console.log(`---------------\n The United Nations Vector Tile Toolkit \n---------------\nSystem starts at ${iso()}. \n---------------`)


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

const shutdown = () =>{
  console.log(`---------------\nSystem shutdown at ${iso()}. \nThank you (^o^)/\n---------------`)
}

const q = new Queue(async (input,cb) => {
    console.log(`${input}: started!`)
    const startTime = iso()
    const [z, x, y] = input.split('-').map(v => Number(v))
    const tmpPath = `${outputDir}/${input}-test.txt`

    for (relation of relations){
        while (!isIdle()){
            await sleep(5000)
            //sleep(5000)
        } try {
            await postGISaccess(input, relation) //input is the key
            //postGISaccess(input, relation)
            return cb()
        } catch (e) {
            cb(true)
        }
    }
/*
    setTimeout(()=>{
        console.log(`${input} (z=${z}, x=${x}, y=${y}): ${tmpPath} end! \n(from ${startTime} to ${iso()})`)
        cb()
    },2000)
*/
},{concurrent:3, maxRetries:2,retryDelay:1000})

q.on('task_finish',(result)=>{
  //console.log(`${result}: end successfully)`)
})
q.on('task_failed', (err) =>{
  console.log(err)
})
q.on('drain',()=>{
  console.log('Queue drains.')
  shutdown()
})

for (let key of tileList){
    //console.log(key)
    q.push(key)
}

