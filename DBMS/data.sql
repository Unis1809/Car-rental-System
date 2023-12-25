-- Populating the Customer table with 10 tuples
INSERT INTO Customer (ssn, fname, lname, gender, address, phonenumber)
VALUES
    ('111-22-3333', 'John', 'Doe', 'M', '123 Main St', '555-1234'),
    ('222-33-4444', 'Jane', 'Smith', 'F', '456 Oak St', '555-5678'),
    ('333-44-5555', 'Robert', 'Johnson', 'M', '789 Pine St', '555-8765'),
    ('444-55-6666', 'Emily', 'Williams', 'F', '101 Elm St', '555-4321'),
    ('555-66-7777', 'Michael', 'Davis', 'M', '202 Maple St', '555-9876'),
    ('666-77-8888', 'Ella', 'Brown', 'F', '303 Cedar St', '555-3456'),
    ('777-88-9999', 'Daniel', 'Anderson', 'M', '404 Birch St', '555-6543'),
    ('888-99-0000', 'Sophia', 'Taylor', 'F', '505 Redwood St', '555-2109'),
    ('999-00-1111', 'William', 'Clark', 'M', '606 Walnut St', '555-7890'),
    ('123-45-6789', 'Olivia', 'Moore', 'F', '707 Oakwood St', '555-9012');

-- Populating the Reservation table with 10 tuples
INSERT INTO Reservation (Reservation_no, reserve_date, pickup_date, return_date)
VALUES
    (1, '2023-01-01', '2023-01-10', '2023-01-15'),
    (2, '2023-02-01', '2023-02-10', '2023-02-15'),
    (3, '2023-03-01', '2023-03-10', '2023-03-15'),
    (4, '2023-04-01', '2023-04-10', '2023-04-15'),
    (5, '2023-05-01', '2023-05-10', '2023-05-15'),
    (6, '2023-06-01', '2023-06-10', '2023-06-15'),
    (7, '2023-07-01', '2023-07-10', '2023-07-15'),
    (8, '2023-08-01', '2023-08-10', '2023-08-15'),
    (9, '2023-09-01', '2023-09-10', '2023-09-15'),
    (10, '2023-10-01', '2023-10-10', '2023-10-15');

-- Populating the Payment table with 10 tuples
INSERT INTO Payment (pay_date, Reservation_no, paymethod)
VALUES
    ('2023-01-05', 1, 'Credit Card'),
    ('2023-02-10', 2, 'Cash'),
    ('2023-03-15', 3, 'Debit Card'),
    ('2023-04-20', 4, 'Credit Card'),
    ('2023-05-25', 5, 'Cash'),
    ('2023-06-30', 6, 'Debit Card'),
    ('2023-07-05', 7, 'Credit Card'),
    ('2023-08-10', 8, 'Cash'),
    ('2023-09-15', 9, 'Debit Card'),
    ('2023-10-20', 10, 'Credit Card');

-- Populating the Creditcard table with 10 tuples
INSERT INTO Creditcard (number, holder_name, CVV, expire_date)
VALUES
    ('1111222233334444', 'John Doe', '123', '2025-01-01'),
    ('5555666677778888', 'Jane Smith', '456', '2024-06-01'),
    ('9999888877776666', 'Robert Johnson', '789', '2026-03-01'),
    ('4444333322221111', 'Emily Williams', '234', '2023-12-01'),
    ('8888777766665555', 'Michael Davis', '567', '2025-08-01'),
    ('2222111100009999', 'Ella Brown', '890', '2024-05-01'),
    ('7777666655554444', 'Daniel Anderson', '123', '2026-10-01'),
    ('3333222211110000', 'Sophia Taylor', '456', '2023-07-01'),
    ('6666555544443333', 'William Clark', '789', '2025-04-01'),
    ('1234123412341234', 'Olivia Moore', '012', '2024-09-01');

-- Populating the Car table with 10 tuples
INSERT INTO Car (plate_id, status, year, model, price_per_day, office_id, Reservation_no)
VALUES
    ('ABC123', 'active', 2022, 'Sedan', 50.00, 1, 1),
    ('XYZ789', 'active', 2021, 'SUV', 70.00, 2, 2),
    ('LMN456', 'active', 2023, 'Hatchback', 60.00, 1, 3),
    ('QRS789', 'out of service', 2020, 'Convertible', 80.00, 2, 4),
    ('TUV012', 'active', 2022, 'Sedan', 55.00, 1, 5),
    ('WXY345', 'active', 2021, 'SUV', 75.00, 2, 6),
    ('IJK678', 'out of service', 2023, 'Hatchback', 65.00, 1, 7),
    ('OPQ901', 'active', 2020, 'Convertible', 85.00, 2, 8),
    ('RST234', 'active', 2022, 'Sedan', 52.00, 1, 9),
    ('UVW567', 'active', 2021, 'SUV', 72.00, 2, 10);

-- Populating the Office table with 2 tuples (for simplicity)
INSERT INTO Office (office_id, email, phonenumber, region, city, country)
VALUES
    (1, 'office1@example.com', '555-6789', 'North', 'Cityville', 'Countryland'),
    (2, 'office2@example.com', '555-9876', 'South', 'Villagetown', 'Countryland');