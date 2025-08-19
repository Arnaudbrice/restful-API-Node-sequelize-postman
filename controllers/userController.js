import { User, Note } from "../models/association.js";

// POST /users
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

// GET /users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    // note: Express validator middleware if used , has error.msg property and not error.message
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id
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

// PUT /users/:id
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

// DELETE /users/:id
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
