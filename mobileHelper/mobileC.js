const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'kw5tm45ddfp9f34v',
    publicKey: 'z93wn4y4qhyzxbsn',
    privateKey: 'e14f1a79764a021fe1b2ed134134852c'
});

paymentMethod = async function (req, res) {
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
    let email = req.query.email;
    console.log("id: " + id);
    console.log("email:" + email);
    gateway.customer.create({
        id: id,
        email: email
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

module.exports = {
    paymentMethod,
    getClientToken,
    createUser
}