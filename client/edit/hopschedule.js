
Template.hopScheduleAdd.events({
    'click button#hs-add': function(evt) {
        var hopSchedule = formula().hopSchedule;
        if(!hopSchedule) { hopSchedule = []; }
        hopSchedule.push({ingredient: $('#hops-new-item').val(), amount: $('#hops-new-item-amount').val(), time: $('#hops-new-item-time').val()});
        Formulas.update(formula()._id, {$set: {hopSchedule: hopSchedule}});
    }
});

Template.hopScheduleList.hopSchedule = function() {
    return formula().hopSchedule;
};

Template.hopScheduleList.events({
    'click #remove-item': function() {
        Formulas.update(formula()._id, {$pull: {hopSchedule: {ingredient: this.ingredient, amount: this.amount, time: this.time}}});
    }
});
