// ssh -i "device-manager.pem" ec2-user@ec2-54-94-254-219.sa-east-1.compute.amazonaws.com
// ssh -i "device-manager.pem" ubuntu@ec2-52-67-106-26.sa-east-1.compute.amazonaws.com
// mysql -h cordeirolucas42.cxpqrbghq6gw.sa-east-1.rds.amazonaws.com -P 3306 -u admin -p
// sudo "$(which node)" express-test.js
// https://medium.com/cs-note/setup-node-and-express-on-aws-ec2-windows-7-8cb499ab14eb
// Using pm2 to handle the application https://www.npmjs.com/package/pm2

// CONFIGURE DATABASE
require('dotenv').config(); //process.env. to use enviroment variables
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('devices_manager', 'admin', process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_ENDPOINT,
    port: process.env.DB_PORT
});
class Category extends Model { }
class Device extends Model { }
Category.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Category' // We need to choose the model name
});
Device.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    color: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    partNumber: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            min: 0
        }
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Device' // We need to choose the model name
});
Category.hasMany(Device, {foreignKey: "category"})
Device.belongsTo(Category)

// CONFIGURE EXPRESS APP
const express = require('express')
const app = express()
const port = 9000

// API ENDPOINTS
app.get('/', (req, res) => {
    res.send(`Olá! Bem-vindo!`)
})

app.get('/category/:id', async (req, res) => {
    if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        if (category) res.send(`Categoria com id ${category.id}, e nome ${category.name}.`)
    } else {
        res.send(`Category not found`)
    }
})

app.get('/device/:id', async (req, res) => {
    if (req.params.id) {
        const device = await Device.findByPk(req.params.id, {include: Category})
        if (device) res.send(`Device with id ${device.id} from category ${device.Category.name}, color ${device.color} and part number ${device.partNumber}.`)

        /* const device = await Device.findByPk(req.params.id)
        if (device) {
            const category = await Category.findByPk(device.category)
            if (category) {
                res.send(`Device with id ${device.id} from category ${category.name}, color ${device.color} and part number ${device.partNumber}.`)
            }            
        } */
    } else {
        res.send(`Device not found`)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://ec2-54-94-254-219.sa-east-1.compute.amazonaws.com:${port}`)
})