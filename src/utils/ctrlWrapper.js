export const ctrlWrapper = (ctrl) => {
  const wrapped = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
      next(err); // ✅ сюди прилітають throw з контролерів
    }
  };
  return wrapped;
};
