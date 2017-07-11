const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const Resolvers = require('./resolvers').module.Resolvers;

const Schema = [`
  # declare custom scalars
  scalar Date

  # a trip chat entity
  type Trip {
    id: Int! # unique id for the trip
    name: String # name of the trip
    users: [User]! # users in the trip
    messages(limit: Int, offset: Int): [Message] # messages sent to the trip
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message] # messages sent by user
    trips: [Trip] # trips the user belongs to
    friends: [User] # user's friends/contacts
    jwt: String # json web token for access
  }

  # a message sent from a user to a trip
  type Message {
    id: Int! # unique id for message
    to: Trip! # trip message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User

    # Return messages sent by a user via userId
    # Return messages sent to a trip via tripId
    messages(tripId: Int, userId: Int): [Message]

    # Return a trip by its id
    trip(id: Int!): Trip
  }

  type Mutation {
    # send a message to a trip
    createMessage(text: String!, tripId: Int!): Message
    createTrip(name: String!, userIds: [Int]): Trip
    deleteTrip(id: Int!): Trip
    leaveTrip(id: Int!): Trip # let user leave trip
    updateTrip(id: Int!, name: String): Trip
    login(email: String!, password: String!): User
    signup(email: String!, password: String!, username: String): User
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the trips with one of these tripIds
    messageAdded(tripIds: [Int]): Message
    tripAdded(userId: Int): Trip
  }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

exports.module = {
  Schema,
  executableSchema
};
