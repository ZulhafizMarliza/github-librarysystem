const express = require("express");
const app = express();
const port = 3000;

// app.use(express.static("librarysystem"));
app.use("/css", express.static("css"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
