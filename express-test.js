// ssh -i "device-manager.pem" ec2-user@ec2-54-94-254-219.sa-east-1.compute.amazonaws.com
// sudo "$(which node)" express-test.js

const express = require('express')
const app = express()
const port = 9000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at ec2-54-94-254-219.sa-east-1.compute.amazonaws.com:${port}`)
})