
Template.boil.pastStarted = function() {
    return Template.boil.started() || Template.boil.finished();
}
Template.boil.started = function() {
    return !!formula().boil && !!formula().boil.startTime && !formula().boil.endTime;
};

Template.hopScheduleAdd.boilDisabled = function() {
    return ""; //Template.boil.pastStarted() ? "disabled" : "";
};
Template.boil.finished = function() {
    return !!formula().boil && !!formula().boil.endTime;
};

Template.boilEvents.boil = function() {
    return formula().boil;
};

Template.boilEvents.boilEvents = function() {
    return formula().boil.events; 
};

Template.boil.canAddEvents = function() {
    var boil = formula().boil;
    return !boil.events || boil.events.length == 0;
};
Template.boil.addBoilEvents = function() {
    var hopSchedule = formula().hopSchedule;
    var boil = formula().boil;

    var boilDuration = boil.duration || 60;

    if(!hopSchedule || !boil) {
        return;
    }

    var events = boil.events || [];

    for(var e in hopSchedule) {
        var thisEvent = hopSchedule[e];
        var eventTime = new Date(boil.startTime);
        eventTime = new Date(eventTime.getTime() + (boilDuration - thisEvent.time) * 60000);
        var boilEvent = {type: "Addition", time: eventTime, detail: thisEvent.amount + ' oz of ' + thisEvent.ingredient};
        events.push(boilEvent);
    }
    boil.events = events;
    Formulas.update(formula()._id, {$set: {boil: boil}});
};

Template.boil.events({
    'click button#start-boil': function() {
        var boil = formula().boil || {};
        var duration = $('#boil-duration').val();
        boil.startTime = new Date();
        boil.duration = duration;
        Formulas.update(formula()._id, {$set: {boil: boil}});
    },
    'click button#boil-events': function() {
        Template.boil.addBoilEvents();
    },
    'click button#finish-boil': function() {
        var boil = formula().boil;
        boil.endTime = new Date();
        Formulas.update(formula()._id, {$set: {boil: boil}});
    }
});
