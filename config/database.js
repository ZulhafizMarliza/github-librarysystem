// const mysql = require("mysql2");

// // const connection = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "root",
// //   database: "library",
// // });

// const connection = mysql.createConnection({
//   host: "206.189.148.130",
//   user: "ejxdbmcj_zmarliza",
//   password: "TmH#IEz#}P~b",
//   database: "ejxdbmcj_librarytest",
//   connectTimeout: 500000, // 10 seconds
//   acquireTimeout: 500000, // 10 seconds - 10k
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database: ", err);
//     return;
//   }
//   console.log("Connected to database");
// });

// module.exports = connection;

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "206.189.148.130",
  user: "ejxdbmcj_zmarliza",
  password: "TmH#IEz#}P~b",
  database: "ejxdbmcj_librarytest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeoutMillis: 500000, // 500 seconds
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to database");

  // Use the connection
  connection.query("SELECT * FROM tblbook", (err, results, fields) => {
    if (err) {
      console.error("Error querying database: ", err);
      return;
    }
    console.log("Results: ", results);
    // Release the connection back to the pool
    connection.release();
  });
});

module.exports = pool;
