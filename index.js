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
            let customerId = null;

            var flagCheck = false
            users.forEach((user) => {
                const isFound = bcrypt.compareSync(password, user.pass);

                if (isFound){
                    flagCheck = true
                    customerId = user.CustomerID;
                    req.session.customer = {
                        CustomerID: customerId,
                    
                    };

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



app.get('/reservation', (req, res) => {
    const customer = req.session.customer;
    const selectedCarId = req.query.selectedCarID;
    const reservationDate = new Date().toLocaleDateString(); // Assuming you want to set it to the current date
    
    if (!selectedCarId) {
        res.status(400).send('No car selected for reservation');
        return;
    }

    const customerId = req.session.customer.CustomerID;

    // Fetch customer details using the customerId from the session
    connection.query(
        'SELECT * FROM customers WHERE CustomerID = ?',
        [customerId],
        (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching customer details:', err);
                res.status(500).send('Error fetching customer details');
                return;
            }

            // Store the fetched customer details in the session
            req.session.customerDetails = results[0];
            
            // Fetch car details using selectedCarId
            connection.query(
                'SELECT * FROM cars WHERE CarID = ?',
                [selectedCarId],
                (err, results) => {
                    if (err || results.length === 0) {
                        console.error('Error fetching car details:', err);
                        res.status(500).send('Error fetching car details');
                        return;
                    }

                    // Store the fetched car details in the session
                    req.session.selectedCar = results[0];

                    // Render the reservation page with the selected car details, customerDetails, and reservationDate
                    res.render('reservation.ejs', { 
                        customerDetails: req.session.customerDetails, 
                        selectedCar: req.session.selectedCar,
                        reservationDate: reservationDate
                    });
                }
            );
        }
    );
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

app.post('/reservation', (req, res) => {
    const selectedCarId = req.body.selectedCarID;
    const { pickupDate, returnDate } = req.body;
    
    // Directly use the selectedCar from the session
    const selectedCar = req.session.selectedCar;
    if (!selectedCar) {
        res.status(400).send('No car selected for reservation');
        return;
    }

    const customerId = req.session.customerDetails.CustomerID;  // Assuming you have the customer's ID in the session
    let unitprice = selectedCar.unitprice;  // Using directly from the session

    // Calculate the total price
    const pickupDateObj = new Date(pickupDate);
    const returnDateObj = new Date(returnDate);
    const totalPrice = (returnDateObj - pickupDateObj) / (1000 * 60 * 60 * 24) * unitprice;

    // Save the reservation to the database
    connection.query(
        'INSERT INTO Reservations (CustomerID, CarID, ReservationDate, PickupDate, ReturnDate, Status) VALUES (?, ?, CURDATE(), ?, ?, ?)',
        [customerId, selectedCarId, pickupDate, returnDate, 'reserved', totalPrice],
        (err, results) => {
            if (err) {
                console.error('Error reserving car:', err);
                res.status(500).send('Error reserving car');
                return;
            }
            
            // Update the car's status to 'reserved'
            connection.query(
                'UPDATE cars SET Status = ? WHERE CarID = ?',
                ['reserved', selectedCarId],
                (err) => {
                    if (err) {
                        console.error('Error updating car status:', err);
                        res.status(500).send('Error updating car status');
                        return;
                    }
                    // Redirect to dashboard after successful reservation and status update
                    res.redirect('/dashboard');
                }
            );
        }
    );
});


app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
