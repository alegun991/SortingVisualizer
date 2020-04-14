const express = require('express')
const app = express()

app.use(express.static('www'));

let server = app.listen(8000, function () {

    let host = server.address().address
    let port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)

})