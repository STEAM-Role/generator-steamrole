const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');
const helmet = require('helmet');
const flash = require('connect-flash');
const JWT = require('../../libs/modules/jwt');
const ACL = require('../../libs/modules/acl');

MiddlewareFactory.register(
  'security',
  app => {
    app.use(
      JWT.initialize({
        secret: 'S3cr3t'
      })
    );

    app.use(flash());
    app.use(helmet.noCache());
    app.use(helmet.frameguard());
    app.disable('x-powered-by');
    app.use(ACL.initialize());
    app.use(ACL.authorize);
  },
  MiddlewareFactory.EVENTS.EVENT_SECURITY
);
