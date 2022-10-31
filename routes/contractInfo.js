const express = require('express');
const contractInfoController = require('../controllers/contractInfo');

const router = express();

router.get('/contract-info', contractInfoController.getContractInfo);

module.exports = router;