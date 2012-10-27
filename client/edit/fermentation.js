
Template.gravity.fermentationData = function() {
    var fermentationData = formula().fermentationData || {};
    if(fermentationData) {
    }

    return fermentationData;
};

Template.gravity.events({
    'keyup input#fermentation-og': function(evt) {
        var gravity = $('#gravity input#fermentation-og').val().trim();
        //var temp = $('#gravity input#fermentation-og-temp').val().trim();
        var fermentationData = formula().fermentationData || {};
        fermentationData.og = fermentationData.og || {};
        fermentationData.og.reading = gravity;
        //fermentationData.og.temp = temp;
        Formulas.update(formula()._id, {$set: {fermentationData: fermentationData}});
    },
    'keyup input#fermentation-fg': function(evt) {
        var gravity = $('#gravity input#fermentation-fg').val().trim();
        var fermentationData = formula().fermentationData || {};
        fermentationData.fg = fermentationData.fg || {};
        fermentationData.fg.reading = gravity;
        Formulas.update(formula()._id, {$set: {fermentationData: fermentationData}});
    }
});
