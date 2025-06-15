const Order = require('../models/order');

exports.confirmation = async (req, res) => {
  const sessionId = req.sessionID;
  // Get the latest order for this session
  const order = await Order.findOne({ sessionId }).sort({ createdAt: -1 });
  if (!order) {
    return res.render('pages/confirmation', {
      pageTitle: 'Order Not Found',
      message: 'No order found for your session.',
      order: null
    });
  }
  res.render('pages/confirmation', {
    pageTitle: 'Order Confirmed',
    message: 'Thank you for your purchase!',
    currentPage: 'confirmation',
    order
  });
};