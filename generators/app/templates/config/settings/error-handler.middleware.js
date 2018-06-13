const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');

MiddlewareFactory.register(
  'static',
  app => {
    app.use((err, req, res, next) => {
      if (!err) {
        return next();
      }
      console.log(err);
      return res.send(err.message);
    });

    // 404
    app.use((req, res) => {
      const contentType = req.headers['content-type'];

      if (contentType && contentType.includes('json')) {
        return res.status(404).json({ url: req.originalUrl, error: 'NOT FOUND' });
      }

      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not Found'
      });
    });
  },
  MiddlewareFactory.EVENTS.EVENT_ROUTER
);
