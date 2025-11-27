import mongoose from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: Array<{ token: string }>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Ё-мое',
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [6, 'Минимальная длина поля "password" - 6'],
      select: false,
    },
    tokens: {
      type: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUser>('user', userSchema);
