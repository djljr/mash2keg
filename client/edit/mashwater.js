
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
        var amount = { };
        amount.qts = Math.round(formula().mashInData.ratio * grainBillWeight() * 100) / 100;
        amount.gallons = Math.round(amount.qts * 0.25 * 100) / 100;
        amount.cups = Math.round(amount.qts * 4 * 100) / 100;
        return amount;
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
