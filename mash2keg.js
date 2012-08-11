GrainBill = new Meteor.Collection("grain-bill");

if (Meteor.is_client) {
    Session.set("mash-r", 0);
    Session.set("mash-t1", 0);
    Session.set("mash-t2", 0);
    var single_infusion_mash = function(r, t1, t2) {
        return (0.2 / r) * (t2 - t1) + t2;
    };

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
}

if (Meteor.is_server) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
