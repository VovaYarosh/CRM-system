const express = require('express');
const router = express.Router();

const controller = require('../controllers/order');


router.get('/',controller.getAll());
router.post('/',controller.register);

module.exports = router;