Formulas = new Meteor.Collection("formulas");
var allowAdmin = function(userId, doc) {
    var user = Meteor.users.findOne(userId);
    if(typeof(user) !== 'undefined') {
        var isAdmin = user.admin;
        return isAdmin;
    }
    else {
        return false;
    }
};

Formulas.allow({
    insert: allowAdmin,
    update: allowAdmin,
    remove: allowAdmin
});
