/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');
const explorerRepository = require('../repository/explorer');

// Explorer Main API
router.get('/', utils.createQueryURL, explorerRepository.getClientsCostDetails);
 
module.exports = router;
