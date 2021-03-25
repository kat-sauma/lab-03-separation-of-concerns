const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }

  static async findById(id) {
    const order = await Order.selectById(id);
    
    return order;
  }

  static async update(id, {  quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order for ${id} updated to ${quantity}`
    );

    const order = await Order.update({ id, quantity });

    return order;
  }

  static async delete(id) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Delete order ${id}`
    );
    const order = await Order.delete(id);
    
    return order;
  }
};
