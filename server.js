/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");
const accountRoute = require("./routes/accountRoute");
const inquiryModel = require("./models/inquiryModel");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const pool = require('./database/');
const csurf = require("csurf");
// Middleware requires
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware must be placed before any middleware that uses it
app.use(
    session({
        store: new (require("connect-pg-simple")(session))({
            createTableIfMissing: true,
            pool,
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        name: "sessionId",
    })
);

// Express Messages Middleware (connect-flash) must be after session
app.use(require("connect-flash")());

// Now, other middleware that depends on the session can follow
app.use(csurf({ cookie: true }));
app.use(utilities.checkJWTToken);

app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

// Add this middleware after app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use("/inv", utilities.handleErrors(inventoryRoute));
app.use("/account", utilities.handleErrors(accountRoute));


// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));


// Checkout route
app.get("/checkout", utilities.handleErrors(async (req, res) => {
    // Get the inv_id from the URL query parameter
    const inv_id = req.query.inv_id;

    // Use the inv_id to fetch vehicle details from the database
    // Note: You will need to create and use a model function for this step
    // const vehicle = await invModel.getInventoryByInvId(inv_id); 

    let nav = await utilities.getNav();
    res.render("checkout/checkout", {
        title: "Checkout",
        // title: "Checkout for " + vehicle.inv_make + " " + vehicle.inv_model,
        nav,
        csrfToken: req.csrfToken()
        // vehicle // Pass vehicle data to the view
    });
}));

// Checkout form submission
app.post("/checkout/submit", utilities.handleErrors(async (req, res) => {
    const { name, email, message, inv_id } = req.body;
    
    try {
            await inquiryModel.addInquiry(name, email, message);
        res.redirect("/thankyou");
    } catch (error) {
        let nav = await utilities.getNav();
        res.render("checkout/checkout", {
            title: "Checkout",
            message: "There was an error submitting your form.",
            nav,
            csrfToken: req.csrfToken()
        });
    }
}));

// Thank you page route
app.get("/thankyou", utilities.handleErrors(async (req, res) => {
    let nav = await utilities.getNav();
    res.render("thankyou", {
        title: "Thank You",
        nav
    });
}));

// File Not Found Route - must be last route in list
app.use(
    utilities.handleErrors(async (req, res, next) => {
        next({
            status: 404,
            message:
                "Sorry, we appear to have lost that page. I guess we broke the steering Wheel on that link, we'll just have to carpool <a href='/'>home</a>",
        });
    })
);

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    if (err.status == 404) {
        message = err.message;
    } else {
        message =
            "OOPS!! We broke the steering Wheel on that request, guess we'll just have to carpool <a href='/'>home</a>";
    }
    res.render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav,
    });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`);
});