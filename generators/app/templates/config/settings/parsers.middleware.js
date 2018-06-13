const MiddlewareFactory = require('../../libs/factories/MiddlewareFactory');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');

MiddlewareFactory.register(
  'parsers',
  app => {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.enable('jsonp callback');
    app.use(cookieParser());
  },
  MiddlewareFactory.EVENTS.EVENT_COMMONS
);
