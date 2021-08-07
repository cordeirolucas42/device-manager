// ssh -i "device-manager.pem" ec2-user@ec2-54-94-254-219.sa-east-1.compute.amazonaws.com
// sudo "$(which node)" express-test.js
// nohup node test1.js
// rm nohup.out
// ps -ef
// kill [process num]
// https://medium.com/cs-note/setup-node-and-express-on-aws-ec2-windows-7-8cb499ab14eb

const express = require('express')
const app = express()
const port = 9000

app.get('/:user', (req, res) => {
    if (req.params.user) {
        res.send(`Olá, ${req.params.user}! Bem-vindo!`)
    } else {
        res.send(`Olá! Bem-vindo!`)
    }
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://ec2-54-94-254-219.sa-east-1.compute.amazonaws.com:${port}`)
})