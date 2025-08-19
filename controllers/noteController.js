import { User, Note } from "../models/association.js";

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
    const note = await Note.create({
      title,
      content,
      userId: user.id
    });
    res.status(201).json({
      note,
      User: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
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
