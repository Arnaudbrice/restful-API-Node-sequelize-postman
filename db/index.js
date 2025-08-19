import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(process.env.PG_URI, { logging: false }); //logging: false prevents Sequelize from logging every SQL query it executes to the console(terminal)

export default sequelize;
