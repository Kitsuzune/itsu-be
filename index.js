import express from 'express';
import cors from 'cors';
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import CartRoute from './routes/CartRoute.js';
import TransactionRoute from './routes/TransactionRoute.js';
import FavouriteRoute from './routes/FavouriteRoute.js';
import ReviewRoute from './routes/ReviewRoute.js';
import BannerRoute from './routes/BannerRoute.js';
import path from 'path';


import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(UserRoute)
app.use(AuthRoute)
app.use(ProductRoute)
app.use(CartRoute)
app.use(TransactionRoute)
app.use(FavouriteRoute)
app.use(ReviewRoute)
app.use(BannerRoute)


app.use('/uploads/profilePicture', express.static(path.join(__dirname, '/uploads/profilePicture')));
app.use('/uploads/productImage', express.static(path.join(__dirname, '/uploads/productImage')));
app.use('/uploads/bannerImage', express.static(path.join(__dirname, '/uploads/bannerImage')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});