
Template.formulaEdit.show = function() {
    return !!formula();
};

Template.formulaEdit.formula = function() {
    return formula();
};

Template.formulaEdit.events({
    'keyup input#amount': function(evt) {
        var amount = $('#edit input#amount').val().trim();
        Formulas.update(formula()._id, {$set: {amount: amount}});
    },
    'keyup input#name': function(evt) {
        var name = $('#edit input#name').val().trim();
        Formulas.update(formula()._id, {$set: {name: name}});
    }
});
