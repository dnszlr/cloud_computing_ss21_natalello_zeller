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
            res.send(result);
        } else {
            res.status(500).send(err);
        }
    });
}

getClientToken = async function (req, res) {
    let customerId = req.body.customerId;
    gateway.clientToken.generate({
        customerId: customerId
    }, (err, response) => {
        // pass clientToken to your front-end
        const clientToken = response.clientToken;
        res.send(clientToken);
    });
}

module.exports = {
    paymentMethod,
    getClientToken
}