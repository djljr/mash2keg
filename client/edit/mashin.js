
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
