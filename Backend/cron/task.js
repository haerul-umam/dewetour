#!/home/haerul/.nvm/versions/node/v14.18.1/bin/node
const database = require("mysql2")

const connection = database.createConnection({
    host : "127.0.0.1",
    user: "root",
    password: "Dbuser12345",
    database: "dewe_tour",
    rowsAsArray: true
})


function main(){

    try{
         connection.query("SELECT id FROM Transactions WHERE status = 'Waiting Payment'",(err, result) =>{
            if (err) {console.log(err)}
            result.map(id => {
                connection.query("UPDATE Transactions set status='Cancel' WHERE id = ?",
                [id[0]],
                (err,result) =>{
                    if(err) {console.log(err)}
                }
                )
            })
            connection.end()
        })
    }catch(e){
        console.log(e)
    }
}

main()
