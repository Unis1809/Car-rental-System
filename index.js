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

//Login post request
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database for the user
    connection.query( 'SELECT * FROM users WHERE username = ?',
        [username],
        (err, users) => {
            if (err) {
                res.status(500).send('Error during login');
            }
            if (users.length === 0) {
                res.redirect('/');
            }else{
                var flagCheck = false
                users.forEach((user) => {
                    const isFound = bcrypt.compareSync(password, user.password);
                    console.log(isFound);
                    if (isFound){
                        flagCheck = true
                        req.session.user = user;
                        res.redirect('/dashboard');
                        return;
                    }

                });
                if(!flagCheck) {
                res.status(401).send('Invalid username or password');
                }
            }
            
        });
});

// register get request 
app.get('/register', (req, res) => {
    res.render('register.ejs');
});


app.post('/register', (req, res) => {  // Needed : check for email or pass validations & check if the username is already exists
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 20);

    // Insert the new user into the database
    connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, results) => {
            if (err) throw err;
            console.log('Hashed Password:', hashedPassword);
            res.redirect('/');
        }
    );
});


app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        const renders = {
            username: req.session.user.username
        }
        res.render('welcome.ejs', renders);
    } else {
        res.redirect('/');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
