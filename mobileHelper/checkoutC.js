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
        res.send(result);
    });
}

module.exports = {
    paymentMethod
}