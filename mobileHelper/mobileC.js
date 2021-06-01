const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'kw5tm45ddfp9f34v',
    publicKey: 'z93wn4y4qhyzxbsn',
    privateKey: 'e14f1a79764a021fe1b2ed134134852c'
});

receivePayment = async function (req, res) {
    const nonceFromTheClient = req.body.payment_method_nonce;
    const amount = req.body.amount;
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if (result) {
            console.log("result incoming");
            console.log(result);
            res.send(result);
        } else {
            res.status(500).send(err);
        }
    });
}

sendPayment = async function (req, res) {
    let amount = req.query.amount;
    let transactionId = req.query.transactionId;
    let supplierId = req.query.supplierId;
    console.log("Received amount:" + amount);
    console.log("Received transaction ID:" + transactionId);
    console.log("Received supplier ID:" + supplierId);
}

refundPayment = async function (req, res) {
    let transactionId = req.body.transactionId;
    let amount = req.body.amount;
    let customerId = req.body.customerId;
    gateway.transaction.refund(transactionId, (err, result) => {
        if (result) {
            res.send(result.success);
        } else {
            res.status(500).send(err);
        }
    });
}

getClientToken = async function (req, res) {
    let customerId = req.query.id
    console.log("customerId:" + customerId);
    gateway.clientToken.generate({
        customerId: customerId
    }, (err, response) => {
        // pass clientToken to your front-end
        if (response) {
            const clientToken = response.clientToken;
            res.send(clientToken);
        } else {
            res.status(500).send(err);
        }
    });
}

createUser = async function (req, res) {
    console.log(req.query);
    let id = req.query.id;
    let email = req.query.lastName;
    console.log("id: " + id);
    console.log("email:" + email);
    gateway.customer.create({
        id: id,
        lastName: email
    }, (err, result) => {
        if (result) {
            console.log(result);
            res.send(result.customer.id);
        } else {
            console.log("error");
            res.status(500).send(err);
        }
    });
}

getLandingPage = function (req, res, next) {
    res.render('landingPage', {title: 'LandingPage'});
}


module.exports = {
    receivePayment,
    sendPayment,
    refundPayment,
    getClientToken,
    createUser,
    getLandingPage
}