
var formula = function() {
    return Formulas.findOne(Session.get('formula_id'));
};

var formatDatePart = function(part) {
    if(part < 10) { return "0" + part; }
    else { return "" + part; }
};
Handlebars.registerHelper("formatDate", function(date) {
    var date = new Date(date);
    return date.getFullYear() + "-" + formatDatePart(date.getMonth() + 1) + "-" + formatDatePart(date.getDate());
});
Handlebars.registerHelper("formatDateTime", function(date) {
    var date = new Date(date);
    return date.getFullYear() + "-" + formatDatePart(date.getMonth() + 1) + "-" + formatDatePart(date.getDate()) + " " + formatDatePart(date.getHours()) + ":" + formatDatePart(date.getMinutes());
});
Handlebars.registerHelper("formatDateWithSeconds", function(date) {
    var date = new Date(date);
    return date.getFullYear() + "-" + formatDatePart(date.getMonth() + 1) + "-" + formatDatePart(date.getDate()) + " " + formatDatePart(date.getHours()) + ":" + formatDatePart(date.getMinutes()) + ":" + formatDatePart(date.getSeconds());
});

Template.page.preserve({
    'input[id]': function (n) { 
      return n.id; 
    },
    'textarea#mash-notes': true
});

Template.page.events({
    'click a#list': function() {
        Session.set('formula_id', undefined);
    },
    'click a#delete': function() {
        Formulas.remove(this._id);
    }
});
