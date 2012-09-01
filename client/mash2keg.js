
var formula = function() {
    return Formulas.findOne(Session.get('formula_id'));
};

Template.page.preserve({
    'input[id]': function (n) { 
      return n.id; 
    },
    'textarea#mash-notes': true
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

var grainBillWeight = function() {
    return _.reduce(formula().bill, function(weight, billItem) {
       return weight + parseInt(billItem.amount);
    }, 0);
};

Template.grainBillList.bill = function() {
    return formula().bill;
};

Template.grainBillList.events({
    'click #remove-item': function() {
        Formulas.update(formula()._id, {$pull: {bill: {grain: this.grain, amount: this.amount}}});
    }
});

Template.grainBillList.totalWeight = function() {
    return grainBillWeight();
};

Template.mashWater.precomputed = function() {
    var grainWeight = grainBillWeight();
    var precomputed = {};
    precomputed.onePointTwoFive = grainWeight * 1.25 || 0; 
    precomputed.onePointFive = grainWeight * 1.5 || 0; 

    return precomputed;
};

Template.mashWater.unset = function() {
    return !formula().mash || !formula().mash.ratio;
};

Template.mashWater.amount = function() {
    if(formula().mash && formula().mash.ratio) {
        return formula().mash.ratio * grainBillWeight();
    }
};

Template.mashWater.events({
    'click #water-set': function() {
        var ratio = $('input[name=water-ratio]:checked').val()
        if(ratio) {
            Formulas.update(formula()._id, {$set: {mash: { ratio: ratio }}});
        }
    },
    'click #water-unset': function() {
        Formulas.update(formula()._id, {$unset: {mash: { ratio: 1 }}});
    }
});

Template.mashIn.mash = function() {
    var mash = formula().mash;
    if(mash) {
        mash.ratio = parseFloat(mash.ratio);
        if(isNaN(mash.ratio)) { mash.ratio = 0; }

        mash.grainTemp = parseFloat(mash.grainTemp);
        if(isNaN(mash.grainTemp)) { mash.grainTemp = 0; }

        mash.targetTemp = parseFloat(mash.targetTemp);
        if(isNaN(mash.targetTemp)) { mash.targetTemp = 0; }
    }
    else {
        mash = {ratio: 0, grainTemp: 0, targetTemp: 0}
    }

    return mash;
};

var singleInfusionMash = function(r, t1, t2) {
    return (0.2 / r) * (t2 - t1) + t2;
};

Template.mashIn.waterTemp = function() {
    var mash = Template.mashIn.mash();
    if(mash) {
        if(mash.ratio === 0) { return 0;}
        else {
            return singleInfusionMash(mash.ratio, mash.grainTemp, mash.targetTemp).toFixed(2);
        }
    }
    else {
        return 0;
    }
};

Template.mashIn.events({
    'keyup input#mash-t1': function(evt) {
        var temp = $('#mashTemp input#mash-t1').val().trim();
        var mash = formula().mash;
        mash.grainTemp = temp;
        Formulas.update(formula()._id, {$set: {mash: mash}});
    },
    'keyup input#mash-t2': function(evt) {
        var temp = $('#mashTemp input#mash-t2').val().trim();
        var mash = formula().mash;
        mash.targetTemp = temp;
        Formulas.update(formula()._id, {$set: {mash: mash}});
    },
    'keyup textarea#mash-notes': function(evt) {
        var notes = $('textarea#mash-notes').val().trim();
        var mash = formula().mash;
        mash.notes = notes;
        Formulas.update(formula()._id, {$set: {mash: mash}});
    }
});
