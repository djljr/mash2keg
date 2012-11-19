
Template.formulaList.show = function() {
    return !formula();
};

var findAll = function() {
    return Formulas.find({});
};

Template.planning.formulas = function() {
    return findAll();
};

Template.planning.events({
    'click button#addFormula': function() {
        var formula_id = Formulas.insert({'created': new Date()});
        Session.set('formula_id', formula_id);
    },
    'click a.edit': function() {
        Session.set('formula_id', this._id);
    },
    'click div.tile': function() {
        Session.set('formula_id', this._id);
    }
});

Template.planning.tile = function(context, options) {
    var out = "";
    var i = 0;
    var size = context.count();
    var rowSize = options.hash.size || 4;
    var spanSize = 12 / rowSize;

    var startRow = function() {
        return "<div class=\"row\">";
    };
    var endRow = function() {
        return "</div>"
    };
    var divides = function(a, b) {
        return b % a == 0;
    };
    var isLast = function(i) {
        return i+1 == size;
    }

    context.forEach(function(item) {
        if(divides(rowSize, i)) {
            out += startRow();
        }
        out += options.fn(item);
        if(divides(rowSize, i+1) || isLast(i)) {
            out += endRow();
        }

        i++;
    });

    return out;
};

Template.planning.isAdmin = function() {
    if(Meteor.userLoaded()) {
        var user = Meteor.user();
        if(user && user.admin) {
            return true;
        }
    }

    return false;

};
