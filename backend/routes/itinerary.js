const express = require('express');
const router = express.Router();
const { generateItinerary, listItineraries, getLatestItineraryByDestination } = require('../controllers/itineraryController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/generate', generateItinerary);  // CU06
router.get('/', listItineraries);
router.get('/destination/:destinationId', getLatestItineraryByDestination);
module.exports = router;