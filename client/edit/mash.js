
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
    return ""; //Template.mash.pastStarted() ? "disabled" : "";
};
Template.mashIn.mashDisabled = function() {
    return ""; //Template.mash.pastStarted() ? "disabled" : "";
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
