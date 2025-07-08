const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API TaskTamer no ar!');
});



module.exports = router;
