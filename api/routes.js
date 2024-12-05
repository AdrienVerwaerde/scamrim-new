const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');



router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);


module.exports = router;
