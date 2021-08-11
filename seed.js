require('dotenv').config(); //process.env. to use enviroment variables
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('devices_manager', 'admin', process.env.DB_PASS, {
    // the sql dialect of the database
    // currently supported: 'mysql', 'sqlite', 'postgres', 'mssql'
    dialect: 'mysql',
    // custom host; default: localhost
    host: process.env.DB_ENDPOINT,
    // custom port; default: dialect default
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
Category.hasMany(Device)
Device.belongsTo(Category)

const mockCategories = [
    { name: 'Smartphone' },
    { name: 'Tablet' },
    { name: 'iPhone' },
    { name: 'SmartTV' },
    { name: 'Laptop' },
    { name: 'Desktop' },
    { name: 'Mac Book' },
]

const mockDevices = [
    {
        CategoryId: 1,
        color: 'Pink',
        partNumber: 4286,
    },
    {
        CategoryId: 1,
        color: 'Brown',
        partNumber: 6434,
    },
    {
        CategoryId: 3,
        color: 'Black',
        partNumber: 2345,
    },
    {
        CategoryId: 4,
        color: 'Opal',
        partNumber: 8678,
    },
]

const main = async () => {
    // Sycronize JavaSvript models with MySQL tables
    try {
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");
        let currentEntry = null
        for (category of mockCategories) {
            currentEntry = await Category.create(category)
            // console.log(`Registrado com sucesso: ${currentEntry.toJSON()}`)
            console.log(currentEntry.toJSON())
        }
        console.log("Seed categories registered successfully!")
        for (device of mockDevices) {
            currentEntry = await Device.create(device)
            // console.log(`Registrado com sucesso: ${currentEntry.toJSON()}`)
            console.log(currentEntry.toJSON())
        }
        console.log("Seed devices registered successfully!")

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // try {
    //     await sequelize.authenticate();
    //     console.log('Connection has been established successfully.');
    //   } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    //   }
}
main()
