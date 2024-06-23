const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay'); // Example library, replace with your chosen payment gateway

const app = express();
const port = process.env.PORT || 3000;

// Replace with actual credentials from your payment gateway
const razorpayInstance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to initiate UPI transfer
app.post('/api/transfer', async (req, res) => {
  const { amount, upiId } = req.body;

  try {
    // Example: Creating an order with Razorpay
    const options = {
      amount: amount * 100, // Amount in paisa (if using Razorpay, it expects amount in paisa)
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: 1, // Auto capture payment
      notes: {
        upiId: upiId,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Now redirect user to Razorpay checkout or send necessary details to client side
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
