
Template.grainBillAdd.events({
    'click button#gb-add': function(evt) {
        var bill = formula().bill;
        if(!bill) { bill = []; }
        bill.push({grain: $('#new-item').val(), amount: $('#new-item-amount').val()});
        Formulas.update(formula()._id, {$set: {bill: bill}});
    }
});

var grainBillWeight = function() {
    return _.reduce(formula().bill, function(weight, billItem) {
       return weight + parseFloat(billItem.amount);
    }, 0);
};

Template.grainBillList.bill = function() {
    return formula().bill;
};

Template.grainBillList.events({
    'click .remove-item': function() {
        Formulas.update(formula()._id, {$pull: {bill: {grain: this.grain, amount: this.amount}}});
    }
});

Template.grainBillList.totalWeight = function() {
    return grainBillWeight();
};
