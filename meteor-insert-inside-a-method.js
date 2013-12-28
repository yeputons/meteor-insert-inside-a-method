Items = new Meteor.Collection('items');

if (Meteor.isClient) {
  Template.hello.helpers({
    items: function() { return Items.find({}); }
  });
  Meteor.methods({
    foo: function(text) {
      Items.insert({data: 'fake1 ' + text});
      Items.insert({data: 'fake2 ' + text});
    }
  });

  Template.edit.events({
    'click #add': function() {
      Items.insert({data: $('#data').val()});
    },
    'click #add_bad': function() {
      Items.insert({data: $('#data').val(), deny: true});
    },
    'click #add_method': function() {
      Meteor.call('foo', $('#data').val());
    }
  });
}

if (Meteor.isServer) {
  function wait() {
    for (var i = 0; i < 10000; i++)
    for (var j = 0; j < 10000; j++)
    for (var k = 0; k < 10; k++);
  }

  Meteor.methods({
    foo: function(text) {
      wait();
      Items.insert({data: 'real ' + text});
    }
  });

  Items.allow({
    insert: function() { return true; }
  });
  Items.deny({
    insert: function(userId, doc) {
      wait();
      if (doc.deny) return true;
    }
  });
}
