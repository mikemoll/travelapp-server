const Trip = require('./connectors').module.Trip;
const Message = require('./connectors').module.Message;
const User = require('./connectors').module.User;

// reusable function to check for a user with context
function getAuthenticatedUser(ctx) {
  return ctx.user.then((user) => {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    return user;
  });
}

const messageLogic = {
  from(message) {
    return message.getUser({ attributes: ['id', 'username'] });
  },
  to(message) {
    return message.getTrip({ attributes: ['id', 'name'] });
  },
  createMessage(_, { text, tripId }, ctx) {
    return getAuthenticatedUser(ctx)
      .then(user => user.getTrips({ where: { id: tripId }, attributes: ['id'] })
      .then((trip) => {
        if (trip.length) {
          return Message.create({
            userId: user.id,
            text,
            tripId,
          });
        }
        return Promise.reject('Unauthorized');
      }));
  },
};

const tripLogic = {
  users(trip) {
    return trip.getUsers({ attributes: ['id', 'username'] });
  },
  messages(trip, args) {
    return Message.findAll({
      where: { tripId: trip.id },
      order: [['createdAt', 'DESC']],
      limit: args.limit,
      offset: args.offset,
    });
  },
  query(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then(user => Trip.findOne({
      where: { id },
      include: [{
        model: User,
        where: { id: user.id },
      }],
    }));
  },
  createTrip(_, { name, userIds }, ctx) {
    return getAuthenticatedUser(ctx)
      .then(user => user.getFriends({ where: { id: { $in: userIds } } })
      .then((friends) => {  // eslint-disable-line arrow-body-style
        return Trip.create({
          name,
        }).then((trip) => {  // eslint-disable-line arrow-body-style
          return trip.addUsers([user, ...friends]).then(() => {
            trip.users = [user, ...friends];
            return trip;
          });
        });
      }));
  },
  deleteTrip(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then((user) => { // eslint-disable-line arrow-body-style
      return Trip.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then(trip => trip.getUsers()
        .then(users => trip.removeUsers(users))
        .then(() => Message.destroy({ where: { tripId: trip.id } }))
        .then(() => trip.destroy()));
    });
  },
  leaveTrip(_, { id }, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {
      if (!user) {
        return Promise.reject('Unauthorized');
      }

      return Trip.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then((trip) => {
        if (!trip) {
          Promise.reject('No trip found');
        }

        trip.removeUser(user.id);
        return Promise.resolve({ id });
      });
    });
  },
  updateTrip(_, { id, name }, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {  // eslint-disable-line arrow-body-style
      return Trip.findOne({
        where: { id },
        include: [{
          model: User,
          where: { id: user.id },
        }],
      }).then(trip => trip.update({ name }));
    });
  },
};

const userLogic = {
  email(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id === user.id) {
        return currentUser.email;
      }

      return Promise.reject('Unauthorized');
    });
  },
  friends(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return user.getFriends({ attributes: ['id', 'username'] });
    });
  },
  trips(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return user.getTrips();
    });
  },
  jwt(user) {
    return Promise.resolve(user.jwt);
  },
  messages(user, args, ctx) {
    return getAuthenticatedUser(ctx).then((currentUser) => {
      if (currentUser.id !== user.id) {
        return Promise.reject('Unauthorized');
      }

      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    });
  },
  query(_, args, ctx) {
    return getAuthenticatedUser(ctx).then((user) => {
      if (user.id === args.id || user.email === args.email) {
        return user;
      }

      return Promise.reject('Unauthorized');
    });
  },
};

const subscriptionLogic = {
  tripAdded(baseParams, args, ctx) {
    return getAuthenticatedUser(ctx)
      .then((user) => {
        if (user.id !== args.userId) {
          return Promise.reject('Unauthorized');
        }

        baseParams.context = ctx;
        return baseParams;
      });
  },
  messageAdded(baseParams, args, ctx) {
    return getAuthenticatedUser(ctx)
      .then(user => user.getTrips({ where: { id: { $in: args.tripIds } }, attributes: ['id'] })
      .then((trips) => {
        // user attempted to subscribe to some trips without access
        if (args.tripIds.length > trips.length) {
          return Promise.reject('Unauthorized');
        }

        baseParams.context = ctx;
        return baseParams;
      }));
  },
};

exports.module = {
  messageLogic,
  tripLogic,
  userLogic,
  subscriptionLogic
};