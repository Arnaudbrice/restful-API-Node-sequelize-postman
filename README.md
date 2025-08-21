# CRUD Sequelize Postman Collection

This repository contains a Postman collection for testing CRUD operations with Sequelize.

## Usage

1. Import the `crud-sequilize.postman_collection.json` file into Postman.
2. Update the base URL (`http://localhost:3000`) if necessary to match your API setup.
3. Use the provided requests to test the API.

## Notes

- Ensure your API is running locally on port 3000 before testing.
- Replace any placeholders (e.g., `<API_KEY>`) with actual values.

## advice for frontend with reactjs

```js
import React, { useEffect, useState } from "react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch Notes
  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/notes");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchAllNotes();
  }, []); // Läuft nur einmal beim Mount

  // Fetch Users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []); // Läuft nur einmal beim Mount

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>

      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

or

```js
import React, { useEffect, useState } from "react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:3000/notes"),
          fetch("http://localhost:3000/users")
        ]);

        const notesData = await notesResponse.json();
        const usersData = await usersResponse.json();

        setNotes(notesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Läuft nur einmal beim Mount

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>

      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```
