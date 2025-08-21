import { User, Note, UserNotes } from "../models/association.js";

// POST /notes
export const createNote = async (req, res) => {
  try {
    console.log(req.body);
    const { title, content, userId } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(400).json({ msg: "User not found" });
      return;
    }
    if (!title || !content) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }
    // Bei n:n Beziehung erstellen wir erst die Notiz, dann den Eintrag in der Verknüpfungstabelle

    const note = await Note.create({ title, content });
    await UserNotes.create({
      userId,
      noteId: note.id
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({ include: User });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /notes/:id
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    // populate the note with user data with include
    const note = await Note.findByPk(id, { include: User });
    if (!note) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.json(note);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /notes/:id
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: "title and content are required" });
      return;
    }
    const [rowCount, updatedNotes] = await Note.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      { where: { id: id } },
      { returning: true }
    );

    if (!rowCount) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    const updatedNote = updatedNotes[0];
    res.status(204).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// PUT /notes/:noteId/users/:userId
// Benutzer zu einer Notiz hinzuzufügen
export const updateUserOfNote = async (req, res) => {
  try {
    const { noteId, userId } = req.params;

    console.log("noteId", noteId);
    // Überprüfen, ob die Zuordnung (userId, noteId) bereits besteht in der Assoziationstabelle UserNotes
    const existingAssociation = await UserNotes.findOne({
      where: { UserId: userId, NoteId: noteId }
    });

    // Check if the user is already associated with the note
    if (existingAssociation) {
      // we cannot have the same User 2 times associated with the same Note
      res
        .status(400)
        .json({ error: "User is already associated with this note." });
      return;
    }

    // Ein neues Eintrag in der Verknüpfungstabelle UserNotes erstellen ( ein User kann mindestens eine Notiz zugeordnet werden)
    //! Diese Tabelle verwaltet die Many-to-Many-Beziehung zwischen den User- und Note-Modellen.

    // Proceed to create the association if it doesn't exist
    const association = await UserNotes.create({
      UserId: userId,
      NoteId: noteId
    });
    console.log(association);
    // Ausgabe könnte sein: { userId: 1, noteId: 2, createdAt: ..., updatedAt: ... }
    res.status(201).json(association); //201 because of create
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /notes/:id
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByPk(id);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    const rowCount = await Note.destroy({ where: { id: id } });

    if (!rowCount) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.status(204).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// !Note:Bei einer Many-to-Many-Beziehung zwischen zwei Entitäten ist eine Assoziationstabelle(Association Table hier UserNotes) erforderlich, um die Beziehung zwischen den Entitäten zu verwalten.
// DELETE /notes/:noteId/users/:userId
// delete a user from a note (without to delete the note itself)
export const deleteUserOfNote = async (req, res) => {
  try {
    const { noteId, userId } = req.params;
    const association = await UserNotes.findOne({
      where: { UserId: userId, NoteId: noteId }
    });
    if (!association) {
      res.status(404).json({ error: "User not associated with this note." });
      return;
    }
    const rowCount = await UserNotes.destroy({
      where: { UserId: userId, NoteId: noteId }
    });
    if (!rowCount) {
      res.status(404).json({ error: "User not associated with this note." });
      return;
    }
    res.status(204).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
