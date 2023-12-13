import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mysql from "mysql2";
import session from "express-session";


const app = express();
const PORT = 5000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'cardb',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// get request for home page
app.get("/", async (req, res) => {
    res.render("login.ejs");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for the user
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) throw err;

            if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
                req.session.user = results[0];
                res.redirect('/dashboard'); // sucsessful login
            } else {
                res.redirect('/login');
                // username or password in invalid
            }
        }
    );
});


app.get('/register', (req, res) => {
    res.render('register.ejs');
});


// app.post('/register', (req, res) => {  // Needed : check for email or pass validations & check if the username is already exists
//     const { username, password } = req.body;

//     // Hash the password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Insert the new user into the database
//     connection.query(
//         'INSERT INTO users (username, password) VALUES (?, ?)',
//         [username, hashedPassword],
//         (err, results) => {
//             if (err) throw err;
//             res.redirect('/login');
//         }
//     );
// });


app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}!`);
    } else {
        res.redirect('/login');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
