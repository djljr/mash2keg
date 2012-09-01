
var formula = function() {
    return Formulas.findOne(Session.get('formula_id'));
};

var single_infusion_mash = function(r, t1, t2) {
    return (0.2 / r) * (t2 - t1) + t2;
};

Template.page.preserve({
    'input[id]': function (n) { 
      return n.id; 
    },
});

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
    }
});

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

Template.grainBillAdd.events({
    'click button#gb-add': function(evt) {
        var bill = formula().bill;
        if(!bill) { bill = []; }
        bill.push({grain: $('#new-item').val(), amount: $('#new-item-amount').val()});
        Formulas.update(formula()._id, {$set: {bill: bill}});
    }
});

Template.grainBillList.bill = function() {
    return formula().bill;
};

Template.grainBillList.events({
    'click #remove-item': function() {
        Formulas.update(formula()._id, {$pull: {bill: {grain: this.grain, amount: this.amount}}});
    }
});

Template.mashWater.precomputed = function() {
    var grainWeight = _.reduce(formula().bill, function(weight, billItem) {
       return weight + parseInt(billItem.amount);
    }, 0);

    var precomputed = {};
    precomputed.onePointTwoFive = grainWeight * 1.25 || 0; 
    precomputed.onePointFive = grainWeight * 1.5 || 0; 

    return precomputed;
};

Template.mashWater.unset = function() {
    return !formula().mashWater;
};

Template.mashWater.amount = function() {
    return formula().mashWater;
}

Template.mashWater.events({
    'click #water-set': function() {
        var amount = $('input[name=water-amount]:checked').val()
        if(amount) {
            Formulas.update(formula()._id, {$set: {mashWater: amount}});
        }
    },
    'click #water-unset': function() {
        Formulas.update(formula()._id, {$unset: {mashWater: 1}});
    }
});


/*
Template['grain-bill-add'].events = {
    'click #gb-add': function() {
        GrainBill.insert({
            grain: $('#new-item').val(), 
            amount: $('#new-item-amount').val()
        });

        $('#new-item').val(""); 
        $('#new-item-amount').val("");
    }
};
Template['grain-bill-list']['bill'] = function() {
    return GrainBill.find({});
};

Template['grain-bill-list'].events = {
    'click #remove-item': function() {
        GrainBill.remove(this._id);
    }
};

Template['mash-in'].events = {
    'change #mash-r': function(e) {
        Session.set("mash-r", $(e.target).val());
    },
    'change #mash-t1': function(e) {
        Session.set("mash-t1", $(e.target).val());
    },
    'change #mash-t2': function(e) {
        Session.set("mash-t2", $(e.target).val());
    }
};
Template['mash-in'].Tw = function() {
    return single_infusion_mash(
            parseFloat(Session.get("mash-r")),
            parseFloat(Session.get("mash-t1")),
            parseFloat(Session.get("mash-t2")));

};

Template['mash-in']['mash-r'] = function() {
    return Session.get("mash-r");
};
Template['mash-in']['mash-t1'] = function() {
    return Session.get("mash-t1");
};
Template['mash-in']['mash-t2'] = function() {
    return Session.get("mash-t2");
};
*/
