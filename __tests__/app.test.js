const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('../lib/utils/twilio');
const twilio = require('../lib/utils/twilio');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  let order;
  beforeEach(async() => {
    order = await Order.insert({ quantity: 10 })

    twilio.sendSms.mockReset(); 
  });
  
  it('creates a new order in our database', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '2',
          quantity: 10,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

      expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual({
      id: '2',
      quantity: 10,
    });
  });

  it('ASYNC/AWAIT: retrieves an order in our database', async () => {
    const res = await request(app)
      .get('/api/v1/orders')


    expect(res.body[0]).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('ASYNC/AWAIT: retrieves an order in our database by an ID', async () => {
    const res = await request(app)
      .get('/api/v1/orders/1')


    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('ASYNC/AWAIT: updates order in database, by an ID', async () => {
    const res = await request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 10 });

      expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('ASYNC/AWAIT: deletes order in database, by an ID', async () => {
    const res = await request(app)
      .delete('/api/v1/orders/1')

      expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });
});
