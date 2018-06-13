const consolidate = require('consolidate');
const compress = require('compression');
const morgan = require('morgan');
const config = require('../config');

const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');

MiddlewareFactory.register(
  'commons',
  app => {
    app.use(
      compress({
        filter: (req, res) =>
          /json|text|javascript|css/.test(res.getHeader('Content-Type')),
        level: 9
      })
    );

    app.set('showStackError', false);
    app.engine('server.view.pug', consolidate[config.templateEngine]);
    app.set('view engine', 'server.view.pug');
    app.set('views', './src/views');

    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
      app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
      app.locals.cache = 'memory';
      app.use(morgan('combined'));
    }
  },
  MiddlewareFactory.EVENTS.EVENT_COMMONS
);
