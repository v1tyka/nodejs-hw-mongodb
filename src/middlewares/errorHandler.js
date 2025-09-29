/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  console.error(err); // для дебагу, в продакшені краще замінити на логер

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    data: err.message, // краще віддавати тільки message, без stack
  });
};
