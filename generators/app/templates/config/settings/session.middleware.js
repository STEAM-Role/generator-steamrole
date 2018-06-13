const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');
const config = require('../config');
const session = require('express-session');
const mongoStore = require('connect-mongo')({ session });

MiddlewareFactory.register(
  'session',
  (app, db) => {
    app.use(
      session({
        secret: config.sessionSecret,
        store: new mongoStore({
          db: db.connections[0].db,
          collection: config.sessionCollection
        }),
        cookie: {
          maxAge: 3600000 * 24 * 365 * 50
        },
        resave: true,
        saveUninitialized: true
      })
    );
  },
  MiddlewareFactory.EVENTS.EVENT_COMMONS
);
