const {port} = require("../../_helper/var")
let link = `http://127.0.0.1:${port}/static/uploads/`
exports.zipImageToObj = (arr) => {
    if (arr) {
        const data = arr.map((val) => {
            return val.filename
        })
        return JSON.stringify(data)
    }

    return
}


exports.extractImage = (str) => {
    if (str === null){
        return []
    }
    
    let image = JSON.parse(str)
    return image.map((val) => {
        return link + val
    })
    
}

exports.singleExtactImage = (str) => {
    if (str === null){
        return null
    }

    let image = JSON.parse(str)

    return link + image[0]

}