const {PubSub} = require('apollo-server-express');

const pubsub = new PubSub();

const fs = require('fs');

module.exports = {
  Query: {
    users: (_parent, _args, {}, _info) => {
      const users = require('./users');
      return users;
    },

    user: (_parent, args, {}, _info) => {
      const users = require('./users');
      let newUsers = users.filter(function (e) {
        return (
          e.email && e.email.toLowerCase().includes(args.email.toLowerCase())
        );
      });
      if (newUsers.length > 0) {
        return newUsers[0];
      } else {
        return;
      }
    },
  },

  Mutation: {
    createUser: (_parent, args, {}, _info) => {
      const users = require('./users');
      let filteredUser = users.filter((item) => {
        return item.email === args.email;
      });
      if (filteredUser.length > 0) {
        // If user exists return duplicate error
        return {
          status: 'failed',
          message: 'Duplicate User',
        };
      } else {
        // If user not exists add user
        users.push(args);
        fs.writeFile('./users.json', JSON.stringify(users), (err) => {
          // If error in user creation
          if (err) {
            return {
              status: 'failed',
              message: 'Something Went Wrong',
            };
          }
        });
        pubsub.publish('USER_ADDED', {userAdded: args});
        return {
          status: 'success',
          message: 'User Created',
        };
      }
    },

    updateUser: (_parent, args, {}, _info) => {
      const users = require('./users');
      let isUpdated = false;
      let newUser = users.map((item) => {
        if (item.email === args.email) {
          isUpdated = true;
          if (args.name) {
            item.name = args.name;
          }
          if (args.address) {
            item.address = args.address;
          }
          if (args.age) {
            item.age = args.age;
          }
        }
        return item;
      });
      fs.writeFile('./users.json', JSON.stringify(newUser), (err) => {
        // Checking for errors
        if (err) {
          return {
            status: 'failed',
            message: 'Something Went Wrong',
          };
        }
      });
      if (isUpdated) {
        return {
          status: 'success',
          message: 'User Updted',
        };
      } else {
        return {
          status: 'failed',
          message: 'User Not Found',
        };
      }
    },

    deleteUser: (_parent, args, {}, _info) => {
      const users = require('./users');
      let isDeleted = false;
      let newUsers = users.filter((item) => {
        if (item.email === args.email) {
          isDeleted = true;
        }
        return item.email !== args.email;
      });
      fs.writeFile('./users.json', JSON.stringify(newUsers), (err) => {
        // Checking for errors
        if (err) {
          return {
            status: 'failed',
            message: 'Something Went Wrong',
          };
        }
      });
      if (isDeleted) {
        return {
          status: 'success',
          message: 'User Deleted',
        };
      } else {
        return {
          status: 'failed',
          message: 'User Not Found',
        };
      }
    },
  },

  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(['USER_ADDED']),
    },
  },
};
