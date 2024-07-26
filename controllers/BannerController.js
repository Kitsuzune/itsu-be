import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import Banner from "../models/BannerModel.js";

export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll();

        const formattedBanners = banners.map(banner => {
            const bannerData = banner.toJSON();
            if (banner.id === '241f73b0-d6ce-4e96-9288-d971a728c722') {
                const images = JSON.parse(banner.image);
                bannerData.image = images.map(image => `${process.env.BASE_URL}/uploads/bannerImage/${image}`);
            } else {
                bannerData.image = banner.image === 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' 
                    ? banner.image 
                    : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`;
            }
            return bannerData;
        });

        res.status(200).json({
            message: "Success",
            banners: formattedBanners
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getBannerDetail = async (req, res) => {
    const { bannerId } = req.params;

    try {
        const banner = await Banner.findByPk(bannerId);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (bannerId === '241f73b0-d6ce-4e96-9288-d971a728c722') {
            const images = JSON.parse(banner.image);
            res.status(200).json({
                message: "Success",
                banner: {
                    ...banner.toJSON(), 
                    image: images.map(image => `${process.env.BASE_URL}/uploads/bannerImage/${image}`)
                }
            });
        } else {
            res.status(200).json({
                message: "Success",
                banner: {
                    ...banner.toJSON(),
                    // image: `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
                    image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
                }
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editBanner = async (req, res) => {
    const { bannerId } = req.params;
    const bannerImage = req.files ? req.files : req.file.filename;
    console.log('image', bannerImage);

    try {
        const banner = await Banner.findByPk(bannerId);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (bannerId === '241f73b0-d6ce-4e96-9288-d971a728c722') {
            if (Array.isArray(bannerImage)) {
                const filenames = bannerImage.map(file => file.filename);
                banner.image = JSON.stringify(filenames);
            } else {
                return res.status(400).json({ message: "Invalid image format. It should be an array of strings." });
            }
        } else {
            banner.image = bannerImage;
        }

        await banner.save();

        res.status(200).json({
            message: "Banner updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getThisMonthBanner = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '11a8f69d-305f-40bc-8647-0ce3c0f29470'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStoreBanner = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '1eebd320-8c8b-4e4d-9e3f-8eb14f97c852'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getHomeCarousel = async (req, res) => {
    try {
        const banners = await Banner.findAll({
            where: {
                id: '241f73b0-d6ce-4e96-9288-d971a728c722'
            }
        });

        if (banners.length > 0) {
            const banner = banners[0].toJSON();
            const images = JSON.parse(banner.image);
            banner.image = images.map(image => `${process.env.BASE_URL}/uploads/bannerImage/${image}`);

            res.status(200).json({
                message: "Success",
                banners: banner
            });
        } else {
            res.status(404).json({ message: "Banner not found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getExploreProduct = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '8f314284-4b20-47ad-8702-56af6beaf738'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewArrival01 = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '74e0aa79-4f48-4c2d-819d-f77de9537024'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewArrival02 = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '9ff18785-413c-45bd-bcb8-7643524740e9'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewArrival03 = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: 'c3b5ee40-e682-45bd-9fc7-fea200bb0ca5'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNewArrival04 = async (req, res) => {
    try {
        const banner = await Banner.findOne({
            where: {
                id: '291b066d-3458-4235-87d8-11e29f493cf7'
            }
        });

        res.status(200).json({
            message: "Success",
            banner: {
                ...banner.toJSON(),
                image: banner.image == 'https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' ? banner.image : `${process.env.BASE_URL}/uploads/bannerImage/${banner.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

