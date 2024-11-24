const express = require('express');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');
const BannerRoute = require('../controllers/BannerController.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/bannerImage/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

const conditionalUpload = (req, res, next) => {
    if (req.params.bannerId === '241f73b0-d6ce-4e96-9288-d971a728c722') {
      upload.array('bannerImage')(req, res, next);
    } else {
      upload.single('bannerImage')(req, res, next);
    }
};

router.get('/banner', BannerRoute.getBanners);
router.get('/banner/:bannerId', BannerRoute.getBannerDetail);
router.post('/banner/update/:bannerId', conditionalUpload, BannerRoute.editBanner);

router.get('/banner/v1/get-thisMonth', BannerRoute.getThisMonthBanner);
router.get('/banner/v1/get-store', BannerRoute.getStoreBanner);
router.get('/banner/v1/get-homeCarousell', BannerRoute.getHomeCarousel);
router.get('/banner/v1/get-exploreProduct', BannerRoute.getExploreProduct);
router.get('/banner/v1/get-newArrival1', BannerRoute.getNewArrival01);
router.get('/banner/v1/get-newArrival2', BannerRoute.getNewArrival02);
router.get('/banner/v1/get-newArrival3', BannerRoute.getNewArrival03);
router.get('/banner/v1/get-newArrival4', BannerRoute.getNewArrival04);

module.exports = router;
