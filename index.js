// CRUD USING EXPRESS + MYSQL
// GET = LIST USERS
// POST = ADD USER
// PATCH = EDIT USER
// DELETE = DELETE USER
// ? = placeholder

const express = require("express");
const path = require("path");
const db = require("./db"); // MySQL connection
const app = express();
const port = 80;

// Middleware to handle form data
app.use(express.urlencoded({ extended: false }));   // lets your app read data from HTML forms (when you submit a form with POST).  
app.use(express.json()); // lets your app read JSON data (used in API tools like Postman for PATCH or DELETE).

// Set view engine as pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ---------------- ROUTES ----------------

// POST — Add a new user
app.post("/users", (req, res) => {
  const { first_name, last_name, email, gender, job_title } = req.body;
  const sql =
    "INSERT INTO users (first_name, last_name, email, gender, job_title) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [first_name, last_name, email, gender, job_title], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to add user");
    }
    res.redirect("/users"); // reload user list
  });
});

// GET — Show all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.render("users", { Users: results }); // show all users using pug
  });
});

// GET — Show only user names
app.get("/users/names", (req, res) => {
  db.query("SELECT first_name, last_name FROM users", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    const names = results.map(u => `${u.first_name} ${u.last_name}`);
    res.render("names", { names, total: names.length });
  });
});

// GET + PATCH + DELETE — By ID
app
  .route("/users/:id")

  // Get a single user by ID
  .get((req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database error");
      }
      if (results.length === 0) {
        return res.status(404).send("User not found");
      }
      res.json(results[0]);
    });
  })

  // PATCH — Edit user details
  .patch((req, res) => {
    const { id } = req.params;
    const fields = req.body;

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).send("No fields to update");
    }

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;

    db.query(sql, [...values, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating user");
      }
      res.send("User updated successfully");
    });
  })

  // DELETE — Remove user by ID
  .delete((req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to delete user");
      }
      res.send("User deleted successfully");
    });
  });


// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
