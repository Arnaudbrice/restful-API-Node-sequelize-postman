import sequelize from "../db/index.js";
import { DataTypes } from "sequelize";

const Note = sequelize.define("Note", {
  title: {
    // STRING is like varchar
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(234) // VARCHAR mit Längenbegrenzung
  }
});

export default Note;
