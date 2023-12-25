--Write sql to retrieve All reservations within a specified period including all car and customer information.
SELECT
    R.*,
    C.*,
    Ca.*,
    O.*  -- Assuming you want information from the Office table as well
FROM
    Reservation R
JOIN
    Customer C ON R.ssn = C.ssn
JOIN
    Car Ca ON R.Reservation_no = Ca.Reservation_no
JOIN
    Office O ON Ca.office_id = O.office_id
WHERE
    R.reserve_date >= 'start_date' AND R.reserve_date <= 'end_date';

--Write sql to retrieve All reservations of any car within a specified period including all car information.
SELECT
    R.*,
    Ca.*,
    O.*  -- Assuming you want information from the Office table as well
FROM
    Reservation R
JOIN
    Car Ca ON R.Reservation_no = Ca.Reservation_no
JOIN
    Office O ON Ca.office_id = O.office_id
WHERE
    R.reserve_date >= 'start_date' AND R.reserve_date <= 'end_date';

--Write sql to retrieve The status of all cars on a specific day
SELECT
    plate_id,
    status
FROM
    Car
WHERE
    'specific_day' BETWEEN pickup_date AND return_date;

--Write sql to retrieve All reservations of specific customer including customer information, car model and plate id.
SELECT
    R.*,
    C.*,
    Ca.model,
    Ca.plate_id
FROM
    Reservation R
JOIN
    Customer C ON R.ssn = C.ssn
JOIN
    Car Ca ON R.Reservation_no = Ca.Reservation_no
WHERE
    C.ssn = 'specific_customer_ssn';

--Write sql to retrieve Daily payments within specific period

SELECT
    pay_date,
    SUM(pay_amount) AS total_daily_payments
FROM
    (
        SELECT
            P.pay_date,
            P.pay_amount
        FROM
            Payment P
        WHERE
            P.pay_date BETWEEN 'start_date' AND 'end_date'
    ) AS DailyPayments
GROUP BY
    pay_date;