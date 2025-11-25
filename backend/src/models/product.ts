import mongoose from 'mongoose';

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
      unique: true,
    },
    image: {
      fileName: {
        type: String,
        required: [true, 'Поле "image.fileName" должно быть заполнено'],
      },
      originalName: {
        type: String,
        required: [true, 'Поле "image.originalName" должно быть заполнено'],
      },
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IProduct>('product', productSchema);
