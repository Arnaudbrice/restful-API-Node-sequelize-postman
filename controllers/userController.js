import { User, Note, UserNotes } from "../models/association.js";

//****** GET /users ******
// Retrieve all Users
export const getAllUsers = async (req, res) => {
  try {
    // populate the user with notes with include
    const users = await User.findAll({ include: Note });
    res.json(users);
  } catch (error) {
    // note: Express validator middleware if used , has error.msg property and not error.message
    res.status(500).json({ error: error.message });
  }
};

//****** GET /users/:id ******
// Retrieve a User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // populate the user with notes with include
    const user = await User.findByPk(id, { include: Note });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//****** POST /users ******
// Create a new User
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      res
        .status(400)
        .json({ error: "firstName, lastName and email are required" });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email
    });
    res.status(201).json(user);
  } catch (error) {
    // note: Express validator middleware if used , has error.msg property and not error.message
    res.status(500).json({ error: error.message });
  }
};

//****** PUT /users/:id ******
// Update a User by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      res
        .status(400)
        .json({ error: "firstName, lastName and email are required" });
      return;
    }

    const [rowCount, updatedUsers] = await User.update(
      {
        firstName, //firstName:firstName
        lastName, //lastName:lastName
        email //email:email
      },
      { where: { id: id }, returning: true }
    );

    //rowCount=0 if no rows are updated
    if (!rowCount) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = updatedUsers[0];
    res.status(204).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//****** PUT /users/:userId/notes/:noteId ******
// Handles the update of a single note of a user
//! many-to-many relationship between User and Note
export const updateNoteOfUser = async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    // Überprüfen, ob die Zuordnung(userId, noteId) bereits besteht in der Assoziationstabelle UserNotes
    const existingAssociation = await UserNotes.findOne({
      where: { UserId: userId, NoteId: noteId }
    });

    // Check if the Note is already associated with the User
    if (existingAssociation) {
      res
        .status(400)
        .json({ error: "Note is already associated with this User." });
    }

    // Ein neues Eintrag in der Verknüpfungstabelle UserNotes erstellen ( ein User kann mindestens eine Notiz zugeordnet werden)
    //! Diese Tabelle verwaltet die Many-to-Many-Beziehung zwischen den User- und Note-Modellen.
    // Proceed to create the association if it doesn't exist
    const association = await UserNotes.create({
      UserId: userId,
      NoteId: noteId
    });

    res.status(201).json(association); //201 because of create
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//****** DELETE /users/:id ******
// Delete a User by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const rowCount = await User.destroy({ where: { id: id } });

    if (!rowCount) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(204).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
