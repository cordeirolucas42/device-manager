require('dotenv').config(); //process.env. to use enviroment variables
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('cordeirolucas42', 'cordeirolucas42', process.env.DB_PASS, {
    // the sql dialect of the database
    // currently supported: 'mysql', 'sqlite', 'postgres', 'mssql'
    dialect: 'mysql',
    // custom host; default: localhost
    host: process.env.DP_ENDPOINT,
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
    category: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: "id"
        }
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

const main = async () => {
    // Sycronize JavaSvript models with MySQL tables
    try {
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");
        const tablet = await Category.create({ name: "Tablet" })
        console.log(tablet.toJSON())
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
