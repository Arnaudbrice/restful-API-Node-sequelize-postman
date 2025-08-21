import { Router } from "express";
import * as noteController from "../controllers/noteController.js";

// create a new router
const noteRouter = Router();

noteRouter
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNote);
noteRouter
  .route("/:id")
  .get(noteController.getNoteById)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

noteRouter
  .route("/:noteId/users/:userId")
  .put(noteController.updateUserOfNote)
  .delete(noteController.deleteUserOfNote);

export default noteRouter;
