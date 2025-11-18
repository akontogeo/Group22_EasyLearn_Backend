import express from 'express';
import * as ratingCtrl from '../controllers/ratingController.js';

const router = express.Router({ mergeParams: true });

router.get('/', ratingCtrl.getRatings);
router.post('/', ratingCtrl.submitRating);

export default router;
