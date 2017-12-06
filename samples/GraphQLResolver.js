
class User extends GraphNode {

    constructor() {
        super();
    }

    getSchema() {
        return schema;
    }

    getResolver(self) {
        return {
            User: {
                id(obj, args, context, info) {
                    return obj.id ? obj.id : obj.userId;
                }
            },

            Query: {
                @service('user')
                getCurrentUser(obj, args, context, info, service) {
                    if (context.session && context.session.userId !== -1) {
                        logger.debug('currentUser - session: ', context.session);
                        return service.user.getUserById(null, {id: context.session.userId}, context, info)
                            .then(user => {
                                console.log('got current user: ', user);
                                return user;
                            });
                    }

                    logger.debug('user not logged in');
                    return null;
                },

                @batch('ids')
                @service('user')
                getUsersByIds(obj, args, context, info, service) {
                    const { ids } = args;
                    return service.user.getUsersById(ids, {})
                        .then((response) => {
                            var users = [];
                            _each(response.users, function(user) {
                                user.profileImage = response.images[user.profileImageId];
                                user.id = user.userId;
                                var professional = response.professionals[user.id];
                                if (professional) {
                                    professional.id = professional.userId;
                                    professional.displayName = user.displayName;
                                    user.professional = professional;
                                }
                                users.push(user);
                            });

                            return users;
                        });
                },

                @plural('getUsersByIds', (obj, args) => {return {ids: [args.id]}})
                getUserById() {},

                @batch('userNames')
                @service('user')
                getUsersByUserNames(obj, args, context, info, service) {
                    var { userNames } = args;
                    //console.log('userNames', userNames);
                    return service.user.getUsersByName(userNames, {}).then((response) => {
                        //console.log('users - resolved:', response);
                        var startTime = new Date();
                        //console.log('start processing userNames response: ', startTime.getTime());

                        var users = {};
                        _each(response.users, function(user) {
                            user.profileImage = response.images[user.profileImageId];
                            user.id = user.userId;
                            var professional = response.professionals[user.id];
                            if (professional) {
                                professional.id = professional.userId;
                                professional.displayName = user.displayName;
                                user.professional = professional;
                            }
                            users[user.userName] = user;
                        });

                        // return in the same order as asked
                        var orderedUsers = [];
                        _each(userNames, (userName) => {
                            orderedUsers.push(users[userName]);
                        })

                        var endTime = new Date();
                        //console.log('end processing userNames response: ', endTime.getTime());

                        return orderedUsers;
                    });
                }
            }
        };
    }
}

module.exports = new User();
