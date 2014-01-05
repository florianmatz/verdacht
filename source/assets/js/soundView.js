define([
  'jquery',
  'underscore',
  'backbone',
  'tpl!../templates/sound.template',
  'audioPlayer'
  ], function($, _, Backbone, template, audioPlayer){

    SoundView = Backbone.View.extend({

      className: 'chapter',

      events: {
        'click .replay': 'replay'
      },

      initialize: function() {

      },

      render: function(chapter) {
        this.player = new audioPlayer(this.model.attributes.name);

        this.model.attributes.chapter = chapter;
        this.$el.html(template(this.model.attributes));
        this.$el
          .find('.placeholder-player')
          .replaceWith(this.player.$el);
        return this;
      },

      replay: function(evt) {
        evt.preventDefault();
        console.log('replay');
      }

    });

    return SoundView;

});