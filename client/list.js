
Template.formulaList.show = function() {
    return !formula();
};

Template.formulaList.formulas = function() {
    return Formulas.find({});
};

Template.formulaList.events({
    'click button#addFormula': function() {
        var formula_id = Formulas.insert({'created': new Date()});
        Session.set('formula_id', formula_id);
    },
    'click a.edit': function() {
        Session.set('formula_id', this._id);
    }
});
