const express = require('express')
const redis = require('redis');

const router = express.Router();
const app = express();

const REDIS_URL = process.env.REDIS_URL;

const client = redis.createClient({ url: REDIS_URL });
(async () => {
  await client.connect();
})()

const counterBook = {}

router.post('/counter/:bookId/incr', async (res, req) => {
  const { bookId } = req.params 
  
  try {
   const cnt = await client.incr(bookId);
   counterBook[bookId] = cnt;
  } catch (err) {
    res.json({errcode: 500, errmsg: `redis error: ${err}`});
  }
})

router.get('/counter/:bookId', async (res, req) => {
  const { bookId } = req.params;

  try {
    res.json(counterBook[bookId]);
  } catch (err) {
    res.json({errcode: 500, errmsg: `redis error: ${err}`});
  }
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});