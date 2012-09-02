
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
       return weight + parseFloat(billItem.amount);
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
    return !formula().mashInData || !formula().mashInData.ratio;
};

Template.mashWater.amount = function() {
    if(formula().mashInData && formula().mashInData.ratio) {
        return formula().mashInData.ratio * grainBillWeight();
    }
};

Template.mashWater.events({
    'click #water-set': function() {
        var ratio = $('input[name=water-ratio]:checked').val()
        if(ratio) {
            Formulas.update(formula()._id, {$set: {mashInData: { ratio: ratio }}});
        }
    },
    'click #water-unset': function() {
        Formulas.update(formula()._id, {$unset: {mashInData: { ratio: 1 }}});
    }
});

Template.mashIn.mashInData = function() {
    var mashInData = formula().mashInData;
    if(mashInData) {
        mashInData.ratio = parseFloat(mashInData.ratio);
        if(isNaN(mashInData.ratio)) { mashInData.ratio = 0; }

        mashInData.grainTemp = parseFloat(mashInData.grainTemp);
        if(isNaN(mashInData.grainTemp)) { mashInData.grainTemp = 0; }

        mashInData.targetTemp = parseFloat(mashInData.targetTemp);
        if(isNaN(mashInData.targetTemp)) { mashInData.targetTemp = 0; }
    }
    else {
        mashInData = {ratio: 0, grainTemp: 0, targetTemp: 0}
    }

    return mashInData;
};

var singleInfusionMash = function(r, t1, t2) {
    return (0.2 / r) * (t2 - t1) + t2;
};

Template.mashIn.waterTemp = function() {
    var mashInData = Template.mashIn.mashInData();
    if(mashInData) {
        if(mashInData.ratio === 0) { return 0;}
        else {
            return singleInfusionMash(mashInData.ratio, mashInData.grainTemp, mashInData.targetTemp).toFixed(2);
        }
    }
    else {
        return 0;
    }
};

Template.mashIn.events({
    'keyup input#mash-t1': function(evt) {
        var temp = $('#mashTemp input#mash-t1').val().trim();
        var mashInData = formula().mashInData || {};
        mashInData.grainTemp = temp;
        Formulas.update(formula()._id, {$set: {mashInData: mashInData}});
    },
    'keyup input#mash-t2': function(evt) {
        var temp = $('#mashTemp input#mash-t2').val().trim();
        var mashInData = formula().mashInData || {};
        mashInData.targetTemp = temp;
        Formulas.update(formula()._id, {$set: {mashInData: mashInData}});
    },
    'keyup textarea#mash-notes': function(evt) {
        var notes = $('textarea#mash-notes').val().trim();
        var mashInData = formula().mashInData || {};
        mashInData.notes = notes;
        Formulas.update(formula()._id, {$set: {mashInData: mashInData}});
    }
});

Template.mash.pastStarted = function() {
    return Template.mash.started() || Template.mash.finished();
}
Template.mash.started = function() {
    return !!formula().mash && !!formula().mash.startTime && !formula().mash.endTime;
};

Template.brewName.mashDisabled = function() {
    return Template.mash.pastStarted() ? "disabled" : "";
};
Template.grainBillAdd.mashDisabled = function() {
    return Template.mash.pastStarted() ? "disabled" : "";
};
Template.mashWater.mashDisabled = function() {
    return Template.mash.pastStarted() ? "disabled" : "";
};
Template.mashIn.mashDisabled = function() {
    return Template.mash.pastStarted() ? "disabled" : "";
};
Template.mash.finished = function() {
    return !!formula().mash && !!formula().mash.endTime;
};

Template.mashEvents.mash = function() {
    return formula().mash;
};

Template.mashEvents.mashEvents = function() {
    return formula().mash.events; 
}

Template.mash.events({
    'click button#start-mash': function() {
        var mash = formula().mash || {};
        mash.startTime = new Date();
        Formulas.update(formula()._id, {$set: {mash: mash}});
    },
    'click button#mash-temp-btn': function() {
        var mash = formula().mash;
        var events = mash.events || [];
        events.push({type: "Temperature", time: new Date(), detail: $('#mash-temp-add').val()});
        mash.events = events
        Formulas.update(formula()._id, {$set: {mash: mash}});
    },
    'click button#finish-mash': function() {
        var mash = formula().mash;
        mash.endTime = new Date();
        Formulas.update(formula()._id, {$set: {mash: mash}});
    }
});

Meteor.startup(function() {
});
