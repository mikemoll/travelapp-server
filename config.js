const dotenv = require('dotenv');

dotenv.config({ silent: true });

const JWT_SECRET = process.env.JWT_SECRET;

exports.module = {
  JWT_SECRET
};
