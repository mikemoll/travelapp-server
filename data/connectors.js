const _ = require('lodash')._;
const faker = require('faker');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = new Sequelize('travelapp', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// define trips
const TripModel = db.define('trip', {
  name: { type: Sequelize.STRING },
});

// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});

// define users
const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  version: { type: Sequelize.INTEGER }, // version the password
});

// users belong to multiple trips
UserModel.belongsToMany(TripModel, { through: 'TripUser' });

// users belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });

// messages are sent from users
MessageModel.belongsTo(UserModel);

// messages are sent to trips
MessageModel.belongsTo(TripModel);

// trips have multiple users
TripModel.belongsToMany(UserModel, { through: 'TripUser' });

// create fake starter data
const GROUPS = 2;
const USERS_PER_GROUP = 2;
const MESSAGES_PER_USER = 2;
faker.seed(123); // get consistent data every time we reload app

// here we fake a bunch of trips, users, and messages
db.sync({ force: true }).then(() => _.times(GROUPS, () => TripModel.create({
  name: faker.lorem.words(3),
}).then(trip => _.times(USERS_PER_GROUP, () => {
  const password = faker.internet.password();
  return bcrypt.hash(password, 10).then(hash => trip.createUser({
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: hash,
    version: 1,
  }).then((user) => {
    console.log(
      '{email, username, password}',
      `{${user.email}, ${user.username}, ${password}}`
    );
    _.times(MESSAGES_PER_USER, () => MessageModel.create({
      userId: user.id,
      tripId: trip.id,
      text: faker.lorem.sentences(3),
    }));
    return user;
  }));
})).then((userPromises) => {
  // make users friends with all users in the trip
  Promise.all(userPromises).then((users) => {
    _.each(users, (current, i) => {
      _.each(users, (user, j) => {
        if (i !== j) {
          current.addFriend(user);
        }
      });
    });
  });
})));

const Trip = db.models.trip;
const Message = db.models.message;
const User = db.models.user;

exports.module = { Trip, Message, User };
