import { celebrate, Joi, Segments } from 'celebrate';

export const validateObjId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Некорректный формат ID',
      'string.length': 'ID должен содержать 24 символа',
      'any.required': 'ID обязателен',
    }),
  }),
});

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required().messages({
      'string.min': 'Минимальная длина поля "title" - 2',
      'string.max': 'Максимальная длина поля "title" - 30',
      'any.required': 'Поле "title" должно быть заполнено',
    }),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required().messages({
          'any.required': 'Поле "image.fileName" должно быть заполнено',
        }),
        originalName: Joi.string().required().messages({
          'any.required': 'Поле "image.originalName" должно быть заполнено',
        }),
      })
      .required()
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    category: Joi.string().required().messages({
      'any.required': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string().messages({
      'string.base': 'Поле "description" должно быть строкой',
    }),
    price: Joi.number().allow(null).default(null).messages({
      'number.base': 'Поле "price" должно быть числом или null',
    }),
  }),
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(2).max(30).messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
      }),
      image: Joi.object().keys({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      }),
      category: Joi.string(),
      description: Joi.string(),
      price: Joi.number().allow(null),
    })
    .min(1)
    .messages({
      'object.min': 'Необходимо передать хотя бы одно поле для обновления',
    }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Поле "payment" должно быть "card" или "online"',
      'any.required': 'Поле "payment" должно быть заполнено',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Поле "email" должно быть валидным email',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'Поле "phone" должно быть заполнено',
    }),
    address: Joi.string().required().messages({
      'any.required': 'Поле "address" должно быть заполнено',
    }),
    total: Joi.number().required().messages({
      'number.base': 'Поле "total" должно быть числом',
      'any.required': 'Поле "total" должно быть заполнено',
    }),
    items: Joi.array()
      .items(
        Joi.string().hex().length(24).messages({
          'string.hex': 'ID товара должен быть валидным',
          'string.length': 'ID товара должен содержать 24 символа',
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Список товаров не может быть пустым',
        'any.required': 'Поле "items" должно быть заполнено',
      }),
  }),
});

export const validateRegisterBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Поле "email" должно быть валидным email',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Минимальная длина поля "password" - 6',
      'any.required': 'Поле "password" должно быть заполнено',
    }),
  }),
});

export const validateLoginBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Поле "email" должно быть валидным email',
      'any.required': 'Поле "email" должно быть заполнено',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Поле "password" должно быть заполнено',
    }),
  }),
});
