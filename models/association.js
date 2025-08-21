import sequelize from "../db/index.js";
import Note from "./Note.js";
import User from "./user.js";

// Assoziationen: n:n Beziehung über Verknüpfungstabelle UserNotes
// erstellt automatisch UserId und NoteId
// !note:achte auf die Großschreibung der UserId und NoteId (UserId und NoteId automatisch erstellt)
const UserNotes = sequelize.define("UserNotes");
// User has many notes (many to many)
User.belongsToMany(Note, {
  through: "UserNotes"
});
Note.belongsToMany(User, {
  through: "UserNotes"
});

/* // User has many notes (one to many)
User.hasMany(Note, {
  foreignKey: "userId",
  onDelete: "CASCADE" //if a user is deleted, delete all notes associated with that user
}); //fetch all notes for a user
Note.belongsTo(User, {
  foreignKey: "userId"
}); //find the user for a specific note
 */

// top level await is required to ensure that the database is synchronized before the code continues
await sequelize.sync();
export { Note, User, UserNotes };
