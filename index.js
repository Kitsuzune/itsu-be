const express = require('express');
const cors = require('cors');
const UserRoute = require('./routes/UserRoute.js');
const AuthRoute = require('./routes/AuthRoute.js');
const ProductRoute = require('./routes/ProductRoute.js');
const CartRoute = require('./routes/CartRoute.js');
const TransactionRoute = require('./routes/TransactionRoute.js');
const FavouriteRoute = require('./routes/FavouriteRoute.js');
const ReviewRoute = require('./routes/ReviewRoute.js');
const BannerRoute = require('./routes/BannerRoute.js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// // const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserRoute);
app.use(AuthRoute);
app.use(ProductRoute);
app.use(CartRoute);
app.use(TransactionRoute);
app.use(FavouriteRoute);
app.use(ReviewRoute);
app.use(BannerRoute);

app.use('/uploads/profilePicture', express.static(path.join(__dirname, '/uploads/profilePicture')));
app.use('/uploads/productImage', express.static(path.join(__dirname, '/uploads/productImage')));
app.use('/uploads/bannerImage', express.static(path.join(__dirname, '/uploads/bannerImage')));

app.get('/', (req, res) => {
    res.send('yee api jalan');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});