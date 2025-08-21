const baseUrl = "http://localhost:3000";

const fetchAllNotes = async () => {
  try {
    const response = await fetch(`${baseUrl}/notes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// inside my UsseEfect
// GET /users
console.log(await fetchAllNotes());
const fetchAllUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// const createUser= async (firstName, lastName, email)
// POST /users
const createUser = async formData => {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    //parse JSON string from the response body into a JavaScript object or array.
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

console.log(await createUser());

// PUT /users/:id
const updateUser = async (formData, userId) => {
  try {
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
// DELETE /users/:id
const deleteUser = async userId => {
  try {
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

console.log(await updateUser());
