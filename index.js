import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mysql from "mysql2";
import session from "express-session";


const app = express();
const PORT = 5000;
// var customer;
// var car;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '123456789nnn',
    resave: false,
    saveUninitialized: false
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

            const user = users[0];
            const passCheck = bcrypt.compareSync(password, user.pass);

            if (passCheck) {
                req.session.customer = user;
                res.redirect('/dashboard');
                return;
            } else {
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



app.get('/reservation', (req, res) => {
    const selectedCarId = req.query.CarID;
    const reservationDate = new Date().toLocaleDateString(); // Assuming it to the current date

            // Fetch car details 
            connection.query(
                'SELECT * FROM cars WHERE CarID = ?',
                [selectedCarId],
                (err, selectedCar) => {
                    const car = selectedCar[0];
                    if (err || selectedCar.length === 0) {
                        console.error('Error fetching car details:', err);
                        res.status(500).send('Error fetching car details');
                        return;
                    }
                    req.session.car = car;
                    const customer = req.session.customer;
                    const renders = {
                        customerDetails: customer,
                        selectedCar: car,
                        reservationDate: reservationDate
                    }
                    res.render('reservation.ejs', renders);

                });
});





app.post('/reservation', (req, res) => {
    const selectedCustomerId = req.session.customer.CustomerID;
    const selectedCarId = req.session.car.CarID;
    const pickupDate = req.body.pickupDate;
    const returnDate = req.body.returnDate;
    const status = 'reserved';
    

    

    // // Save the reservation to the database
    connection.query(
        'INSERT INTO Reservations (CustomerID, CarID, ReservationDate, PickupDate, ReturnDate, Status) VALUES (?, ?, CURDATE(), ?, ?, ?)',
        [selectedCustomerId, selectedCarId, pickupDate, returnDate, status],
        (err, results) => {
            if (err) {
                console.error('Error reserving car:', err);
                res.status(500).send('Error reserving car');
                return;
            }

            // Update the car's status to 'reserved'
            connection.query(
                'UPDATE cars SET Status = ? WHERE CarID = ?',
                [status, selectedCarId],
                (err) => {
                    if (err) {
                        console.error('Error updating car status:', err);
                        res.status(500).send('Error updating car status');
                        return;
                    }
                    // Redirect to dashboard after successful reservation and status update
                    res.redirect('/dashboard');
                });
        });
});

app.get('/dashboard', (req, res) => {
    const customer = req.session.customer;
    connection.query(
        'SELECT * FROM cars',
        (err, cars) => {
            if (err) { 
                res.status(500).send('Error during login');
                return;
            }
            const renders = {
                customerDetails : customer,
                carsList: cars,
                error: "No available cars"
            }
            res.render('welcome.ejs', renders);
        });
});


app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
