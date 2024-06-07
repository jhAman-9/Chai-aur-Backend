    import mongoose from 'mongoose';

    const categoryShema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          required: true,
          type: String,
        },
        productImage: {
          type: String,
        },
        price: {
          type: Number,
          default: 0,
        },
        stock: {
          default: 0,
          type: Number,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true,
        },
        Owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
      { timestamps: true }
    );

    export const Category = mongoose.model('Category', categoryShema);
