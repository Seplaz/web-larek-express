import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

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

const IMAGES_PATH = process.env.UPLOAD_PATH || 'images';

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

productSchema.post('findOneAndDelete', async (doc) => {
  if (doc && doc.image && doc.image.fileName) {
    const filename = path.basename(doc.image.fileName);
    const filePath = path.join(__dirname, '../public', IMAGES_PATH, filename);

    try {
      await fs.promises.unlink(filePath);
      console.log(`Файл ${filename} удалён`);
    } catch (error) {
      console.error(`Ошибка удаления файла ${filename}:`, error);
    }
  }
});

export default mongoose.model<IProduct>('product', productSchema);
