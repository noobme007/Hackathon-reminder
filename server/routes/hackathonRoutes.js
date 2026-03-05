const express = require('express');
const router = express.Router();
const {
    getHackathons,
    createHackathon,
    updateHackathon,
    deleteHackathon,
} = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.route('/').get(getHackathons).post(createHackathon);
router.route('/:id').put(updateHackathon).delete(deleteHackathon);

module.exports = router;
