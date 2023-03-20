const express = require("express");
const app = express();
const port = 5000;

// app.use(express.static("librarysystem"));
app.use("/css", express.static(__dirname + "/css"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//delete
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Import the MySQL connection module
const connection = require("./config/database");

app.get("/books", (req, res) => {
  // Query the database for all books with their categories
  const sql = `SELECT tblbook.id, tblbook.isbn, tblbook.author, tblbook.publisher, tblbook.datereceived, tblcategorybook.categoryname
              FROM tblbook
              INNER JOIN tblcategorybook ON tblbook.tblcategorybook_categoryID = tblcategorybook.categoryID
              ORDER BY tblbook.id`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error querying database: ", err);
      res.status(500).send("Error querying database");
      return;
    }

    res.render("books", { books: results });
  });
});

// Serve the index.html file when the root URL is requested
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle the POST request for inserting a new book record
app.post("/books", (req, res) => {
  const { isbn, author, publisher, category } = req.body;

  // Insert the new book record into the database
  const sql = `INSERT INTO tblbook (isbn, author, publisher, datereceived, tblcategorybook_categoryID)
              VALUES (?, ?, ?, NOW(), ?)`;

  connection.query(sql, [isbn, author, publisher, category], (err, results) => {
    if (err) {
      console.error("Error inserting new book record: ", err);
      res.status(500).send("Error inserting new book record");
      return;
    }

    console.log(`New book record inserted with ID: ${results.insertId}`);
    res.redirect("/books");
  });
});

app.get("/delete/:id", (req, res) => {
  // Get the ID of the book to be deleted from the request parameters
  const id = req.params.id;

  // Query the database for the book with the given ID
  const sql = `SELECT tblbook.id, tblbook.isbn, tblbook.author, tblbook.publisher, tblbook.datereceived, tblcategorybook.categoryname
  FROM tblbook
  INNER JOIN tblcategorybook ON tblbook.tblcategorybook_categoryID = tblcategorybook.categoryID
  WHERE tblbook.id = ?
  ORDER BY tblbook.id;
  `;
  connection.query(sql, id, (err, results) => {
    if (err) {
      console.error("Error querying database: ", err);
      res.status(500).send("Error querying database");
      return;
    }

    // Render the delete.ejs view with the book data
    res.render("delete", { book: results[0] });
  });
});

// Handle the DELETE request for deleting a book record
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  // Delete the book record from the database
  const sql = "DELETE FROM tblbook WHERE id = ?";
  connection.query(sql, id, (err, results) => {
    if (err) {
      console.error("Error deleting book record: ", err);
      res.status(500).send("Error deleting book record");
      return;
    }

    console.log(`Book record with ID ${id} deleted`);
    res.redirect("/books");
  });
});

//Edit

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  // Query the database for the book with the given ID
  const sql = `SELECT tblbook.id, tblbook.isbn, tblbook.author, tblbook.publisher, tblbook.datereceived, tblbook.tblcategorybook_categoryID, tblcategorybook.categoryname, tblcategorybook.categoryID
  FROM tblbook
  INNER JOIN tblcategorybook ON tblbook.tblcategorybook_categoryID = tblcategorybook.categoryID
  WHERE tblbook.id = ?
  ORDER BY tblbook.id;
`;
  connection.query(sql, id, (err, results) => {
    if (err) {
      console.error("Error querying database: ", err);
      res.status(500).send("Error querying database");
      return;
    }

    // Query the database for all categories
    const sqlCategories = "SELECT * FROM tblcategorybook";
    connection.query(sqlCategories, (err, categories) => {
      if (err) {
        console.error("Error querying database: ", err);
        res.status(500).send("Error querying database");
        return;
      }

      // Render the edit.ejs view with the book data and categories array
      res.render("edit", { book: results[0], categories });
    });
  });
});

app.put("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { isbn, author, publisher, category } = req.body;

  // Update the book record in the database
  const sql = `UPDATE tblbook SET isbn=?, author=?, publisher=?, tblcategorybook_categoryID=? WHERE id=?`;
  connection.query(
    sql,
    [isbn, author, publisher, category, id],
    (err, results) => {
      if (err) {
        console.error("Error updating book record: ", err);
        res.status(500).send("Error updating book record");
        return;
      }

      console.log(`Book record updated with ID: ${id}`);
      res.redirect("/books");
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
