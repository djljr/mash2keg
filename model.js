Formulas = new Meteor.Collection("formulas");
var allowAdmin = function(userId, doc) {
    var user = Meteor.users.findOne(userId);
    var isAdmin = user.admin;
    if(typeof(isAdmin) !== 'undefined') {
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
