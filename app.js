// CONFIGURE DATABASE ORM
require('dotenv').config(); //process.env. to use enviroment variables
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('devices_manager', 'admin', process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_ENDPOINT,
    port: process.env.DB_PORT
});
// DEFINE DB MODELS
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
    sequelize,
    modelName: 'Category'
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
    sequelize,
    modelName: 'Device'
});
Category.hasMany(Device)
Device.belongsTo(Category)

// CONFIGURE EXPRESS APP
const express = require('express')
// const https = require('https');
// const http = require('http');
// const fs = require('fs');
const app = express()
var cors = require('cors')
app.use(express.json())
app.use(cors())
// const port = 80
// const options = {
//     key: fs.readFileSync('./https-key.key'),
//     cert: fs.readFileSync('./https-cert.pem')
// };

// API ENDPOINTS
// HOME '/' REDIRECT TO DEVICES
app.get('/', (req, res) => {
    res.redirect('/devices')
})

// READ - ALL DEVICES
app.get('/devices', async (req, res) => {
    const devices = await Device.findAll({ include: Category })
    if (devices) {
        res.json(devices)
    } else {
        //ERROR HANDLING
    }
})

// READ - DEVICE BY ID
app.get('/devices/:id', async (req, res) => {
    const device = await Device.findByPk(req.params.id, { include: Category })
    if (device) {
        res.json(device)
    } else {
        //ERROR HANDLING
    }

})

// CREATE - DEVICE
app.post('/devices', async (req, res) => {
    // DATA VALIDATION
    const category = await Category.findByPk(req.body.CategoryId)
    if (category) {
        const newDevice = await Device.create(req.body)
        if (newDevice) {
            res.json(newDevice)
        } else {
            //ERROR HANDLING
        }
    } else {
        res.json({ result: "Cannot create device because the category inserted does not exist." })
        //ERROR HANDLING
    }

})

// DELETE - DEVICE
app.delete('/devices/:id', async (req, res) => {
    await Device.destroy({
        where: { id: req.params.id }
    })
    //ERROR HANDLING
    res.json({ result: "Device deleted successfully" })
})

// CATEGORIES
// READ - ALL CATEGORIES
app.get('/categories', async (req, res) => {
    const categories = await Category.findAll()
    if (categories) {
        res.json(categories)
    } else {
        //ERROR HANDLING
    }
})

// READ - CATEGORY BY ID
app.get('/categories/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id)
    // if (category) res.send(`Categoria com id ${category.id}, e nome ${category.name}.`)
    if (category) {
        res.json(category)
    } else {
        //ERROR HANDLING
    }
})

// CREATE - CATEGORY
app.post('/categories', async (req, res) => {
    // DATA VALIDATION
    const newCategory = await Category.create(req.body)
    if (newCategory) {
        res.json(newCategory)
    } else {
        //ERROR HANDLING
    }
})

// DELETE - CATEGORY
app.delete('/categories/:id', async (req, res) => {
    const devices = await Device.findAll()
    if (devices) {
        if (devices.map(device => device.CategoryId).filter(CategoryId => CategoryId == req.params.id).length > 0) {
            res.json({ result: "Category cannot be deleted because there are devices associated with it." })
        } else {
            await Category.destroy({
                where: { id: req.params.id }
            })
            //ERROR HANDLING
            res.json({ result: "Category deleted successfully" })
        }
    } else {
        //ERROR HANDLING
    }
})

// START SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server listening at Port ${process.env.PORT}`)
})

// http.createServer(app).listen(9000);
// https.createServer(options, app).listen(443);