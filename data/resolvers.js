const GraphQLDate = require('graphql-date');
const withFilter = require('graphql-subscriptions').withFilter;
const map = require('lodash').map;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Trip = require('./connectors').module.Trip;
const Message = require('./connectors').module.Message;
const User = require('./connectors').module.User;
const pubsub = require('../src/subscriptions').module.pubsub;
const JWT_SECRET = require('../config').module.JWT_SECRET;
const tripLogic = require('./logic').module.tripLogic;
const messageLogic = require('./logic').module.messageLogic;
const userLogic = require('./logic').module.userLogic;

const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'tripAdded';

const Resolvers = {
  Date: GraphQLDate,
  Query: {
    trip(_, args, ctx) {
      return tripLogic.query(_, args, ctx);
    },
    user(_, args, ctx) {
      return userLogic.query(_, args, ctx);
    },
  },
  Mutation: {
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx)
        .then((message) => {
          // Publish subscription notification with message
          pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
          return message;
        });
    },
    createTrip(_, args, ctx) {
      return tripLogic.createTrip(_, args, ctx).then((trip) => {
        pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: trip });
        return trip;
      });
    },
    deleteTrip(_, args, ctx) {
      return tripLogic.deleteTrip(_, args, ctx);
    },
    leaveTrip(_, args, ctx) {
      return tripLogic.leaveTrip(_, args, ctx);
    },
    updateTrip(_, args, ctx) {
      return tripLogic.updateTrip(_, args, ctx);
    },
    login(_, { email, password }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((user) => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: user.id,
                email: user.email,
                version: user.version,
              }, JWT_SECRET);
              user.jwt = token;
              ctx.user = Promise.resolve(user);
              return user;
            }

            return Promise.reject('password incorrect');
          });
        }

        return Promise.reject('email not found');
      });
    },
    signup(_, { email, password, username }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((existing) => {
        if (!existing) {
          // hash password and create user
          return bcrypt.hash(password, 10).then(hash => User.create({
            email,
            password: hash,
            username: username || email,
            version: 1,
          })).then((user) => {
            const { id } = user;
            const token = jwt.sign({ id, email, version: 1 }, JWT_SECRET);
            user.jwt = token;
            ctx.user = Promise.resolve(user);
            return user;
          });
        }

        return Promise.reject('email already exists'); // email already exists
      });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args) => {
          return Boolean(args.tripIds && ~args.tripIds.indexOf(payload.messageAdded.tripId));
        }
      )
    },
    tripAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args) => {
          return Boolean(args.userId && ~map(payload.tripAdded.users, 'id').indexOf(args.userId));
        }
      )
    },
  },
  Trip: {
    users(trip, args, ctx) {
      return tripLogic.users(trip, args, ctx);
    },
    messages(trip, args, ctx) {
      return tripLogic.messages(trip, args, ctx);
    },
  },
  Message: {
    to(message, args, ctx) {
      return messageLogic.to(message, args, ctx);
    },
    from(message, args, ctx) {
      return messageLogic.from(message, args, ctx);
    },
  },
  User: {
    email(user, args, ctx) {
      return userLogic.email(user, args, ctx);
    },
    friends(user, args, ctx) {
      return userLogic.friends(user, args, ctx);
    },
    trips(user, args, ctx) {
      return userLogic.trips(user, args, ctx);
    },
    jwt(user, args, ctx) {
      return userLogic.jwt(user, args, ctx);
    },
    messages(user, args, ctx) {
      return userLogic.messages(user, args, ctx);
    },
  },
};

exports.module = { Resolvers };
