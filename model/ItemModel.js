const {DataTypes}=require('sequelize')
const sequelize=require('../db')

const Item=sequelize.define("Item",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pricePerDay:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},{timestamps:true})

module.exports=Item