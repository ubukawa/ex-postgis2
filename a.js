const iso = () => {
    return (new Date()).toISOString()
}

console.log(`Time: ${iso()}`)
console.log(Date())