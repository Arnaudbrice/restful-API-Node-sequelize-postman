import express from "express";
import cors from "cors";
import path from "path";

import * as userController from "./controllers/userController.js";
import * as noteController from "./controllers/noteController.js";
const app = express();

//express version greater than v4.16
/* sets up the middleware to parse incoming JSON data in the request body. This is necessary for handling POST, PUT, or PATCH requests that send JSON data */
app.use(express.json(), cors());
/*sets up the middleware to parse incoming URL-encoded data in the request body with the querystring library ( extended:false)*/
app.use(
  express.urlencoded({
    extended: false
  })
);

// Serve static files from the public folder
app.use(express.static(path.join(import.meta.dirname, "public")));
app.get("/", async (req, res) => {
  try {
    // check if the database is connected
    await sequelize.authenticate();
    res.json({ message: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app
  .route("/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);
app
  .route("/users/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

app
  .route("/notes")
  .get(noteController.getAllNotes)
  .post(noteController.createNote);
app
  .route("/notes/:id")
  .get(noteController.getNoteById)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port port!`);
});
