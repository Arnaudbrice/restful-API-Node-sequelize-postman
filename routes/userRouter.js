import { Router } from "express";
import * as userController from "../controllers/userController.js";

// create a new router
const userRouter = Router();

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

userRouter.route("/:userId/notes/:noteId").put(userController.updateNoteOfUser);
export default userRouter;
