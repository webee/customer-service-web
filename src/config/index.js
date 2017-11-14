if (process.env.NODE_ENV === 'production') {
  module.exports = { ...require('./default'), ...require('./production') };
} else if (process.env.NODE_ENV === 'development') {
  module.exports = { ...require('./default'), ...require('./development') };
} else {
  module.exports = require('./default');
}
