import User from "./user.js";
import Note from "./note.js";
import sequelize from "../db/index.js";
// User has many notes (one to many)
User.hasMany(Note, {
  foreignKey: "userId",
  onDelete: "CASCADE" //if a user is deleted, delete all notes associated with that user
}); //fetch all notes for a user
Note.belongsTo(User, {
  foreignKey: "userId"
}); //find the user for a specific note

sequelize.sync();
export { User, Note };
