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
    database: 'cars_system',
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
    const email = req.body.email;
    const password = req.body.password;

    // Query the database for the user
    connection.query(
        'SELECT * FROM customers WHERE Email = ?',
        [email],
        (err, users) => {
            if (err) {
                res.status(500).send('Error during login');
                return;
            }

            if (users.length === 0) {
                // User not found
                res.render('login.ejs', { error: 'Invalid email or password' });
                return;
            }

            var flagCheck = false
            users.forEach((user) => {
                const isFound = bcrypt.compareSync(password, user.pass);

                if (isFound){
                    flagCheck = true
                    // req.session.user = user;
                    res.redirect('/dashboard');
                    return;
                }
            });

        if(!flagCheck) {
        res.status(401).send('Invalid username or password');
        }

        });




});

// register get request 
app.get('/register', (req, res) => {
    res.render('register.ejs');
});


app.post('/register', (req, res) => {  // Needed : check for email or pass validations & check if the username is already exists
    const { firstName, lastName, email, phone, address, password } = req.body;

    // Password encryption
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the new user into the database
    connection.query(
        'INSERT INTO customers (FirstName, LastName, Email, Phone, Address, pass) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, address, hashedPassword],
        (err, results) => {
            if (err) {
                return res.status(500).render('register.ejs', { error: 'Account already exists!' });
            }
            // redirect to login page
            res.redirect('/');
        });
});


app.get('/dashboard', (req, res) => {
    connection.query(
        'SELECT * FROM cars',
        (err, cars) =>{
            if (err) {
                res.status(500).send('Error during login');
                return;
            }
            const renders = {
                carsList : cars,
                error : "No available cars"
            } 
            res.render('welcome.ejs', renders);
        }
    )

    // if (req.session.user) {
    //     const renders = {
    //         firstName: req.session.user.FirstName,
    //         lastName: req.session.user.LastName
    //     }
    //     res.render('welcome.ejs', renders);
    // } else {
    //     res.redirect('/');
    // }
});




app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
