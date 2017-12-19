// -------------------------------
// Import Node Modules
// -------------------------------

const cors  = require('cors')
const Pusher = require('pusher')
const express = require('express')
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')

// ------------------------------
//  Create import strip module and pass API KEY
// ------------------------------

const stripe = require('stripe')('STRIPE_API_KEY')

// ------------------------------
// Create express app
// ------------------------------

const app = express()

// ------------------------------
// Load the middlewares
// ------------------------------

app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// ------------------------------
// Load Middlewares
// ------------------------------

const multipartMiddleware = multipart();

// -------------------------------
// Create Pusher Client
// -------------------------------

const pusher = new Pusher({
    appId: 'PUSHERE_APP_ID',
    key: 'PUSHER_API_KEY',
    secret: 'PUSHER_API_SECRET',
    cluster: 'PUSHER_APP_CLUSTER',
    encrypted: true
});

// -------------------------------
// Create app routes
// -------------------------------

app.get('/', function(req, res){
    res.render('index');
});

app.post('/gen-payment', multipartMiddleware, function(req, res){
    console.log( req.body );
    console.log( req.body.stripeToken)
    let amount = 500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer =>
        stripe.charges.create({
            amount,
            description: 'One camera bought from shop',
            currency: "usd",
            customer: customer.id
        })
    )
    .then(charge => {
        // -------------------------------
        // Trigger pusher event
        // ------------------------------
        pusher.trigger('sales', 'payment-completed', {
            "time" : new Date().toDateString(),
            "value" : `\$${charge.amount/100}`,
            "message" : "payment complete...duh!",
            "description" : charge.description
        });
        console.log( charge );
        res.render("charge");
    });
});


// -------------------------------
// Assign port
// -------------------------------

app.listen('3120');
console.log('Listening on localhost:3120');