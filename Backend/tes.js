let pattern = /\/umam\//

let arr = ["haerulumam", "umam","bambang"]

const filter = arr.filter((str) => {
    return pattern.test(str)
})

console.log(filter)