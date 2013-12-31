define([
  'jquery',
  'underscore',
  'backbone',
  'tpl!../templates/sound.template'
  ], function($, _, Backbone, template){

    SoundView = Backbone.View.extend({

      events: {
        'click .replay': 'replay'
      },

      initialize: function() {

      },

      render: function(chapter) {
        console.log('rendering: ', this.model);
        this.model.attributes.chapter = chapter;
        this.$el.html(template(this.model.attributes));
        return this;
      },

      replay: function(evt) {
        evt.preventDefault();
        console.log('replay');
      }

    });

    return SoundView;

});