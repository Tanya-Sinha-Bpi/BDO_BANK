import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
},{timestamps: true});

const ImageModel = mongoose.model('PromotionImage', imageSchema);

export default ImageModel;