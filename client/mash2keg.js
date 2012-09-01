
var formula = function() {
    return Formulas.findOne(Session.get('formula_id'));
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
    return formula().mash.ratio * grainBillWeight();
};

Template.mashWater.events({
    'click #water-set': function() {
        var ratio = $('input[name=water-ratio]:checked').val()
        if(ratio) {
            Formulas.update(formula()._id, {$set: {mash: { ratio: ratio }}});
        }
    },
    'click #water-unset': function() {
        Formulas.update(formula()._id, {$unset: {mash: 1}});
    }
});

Template.mashIn.mash = function() {
    var mash = formula().mash;
    if(mash) {
        mash = {ratio: parseFloat(mash.ratio), grainTemp: parseFloat(mash.grainTemp), targetTemp: parseFloat(mash.targetTemp)};
        if(!mash.ratio || mash.ratio === 0) {
            return 0;
        }
        if(!mash.grainTemp) {
            mash.grainTemp = 0;
        }
        if(!mash.targetTemp) {
            mash.targetTemp = 0;
        }
    }

    return mash;
};

var singleInfusionMash = function(r, t1, t2) {
    return (0.2 / r) * (t2 - t1) + t2;
};

Template.mashIn.waterTemp = function() {
    var mash = Template.mashIn.mash();
    return singleInfusionMash(mash.ratio, mash.grainTemp, mash.targetTemp);
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
