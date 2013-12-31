define([
  'jquery',
  'underscore',
  'backbone',
  'soundModel',
  'soundView',
  'json!../json/sounds.json',
  'utils'
  ], function($, _, Backbone, soundModel, soundView, json, utils){


    AudioView = Backbone.View.extend({

      el: $('#audio .sounds'),
      events: {
        'click .proceed': 'proceed'
      },
      transitionEnd: Utils.prefixedTransitionEnd,
      soundViews: [],
      currentView: 0,

      initialize: function() {
        this.createSounds();
      },

      createSounds: function() {

        _.each(json.sounds, function(item){

          var model = new SoundModel(item),
              view  = new SoundView({
                model: model
              });

          this.soundViews.push(view);

        }, this);

      },

      render: function(nextView) {


        if(nextView) {

          this.$el.one(this.transitionEnd, $.proxy( function() {
            this.renderSoundView(nextView);
          }, this ));

          this.$el.addClass('fading');

        }else {
          // At audio start
          this.renderSoundView(this.soundViews[0]);
        }

        return this;
      },

      renderSoundView: function(view) {
        this.$el
          .off(this.transitionEnd)
          .html(view.render(this.currentView+1).$el)
          .removeClass('fading');
      },

      proceed: function(evt) {
        evt.preventDefault();

        // find out next sound
        var nextSound = $(evt.currentTarget).data('next'),
            nextView = _.find(this.soundViews, function(soundView) {
              return soundView.model.get('name')===nextSound;
            });

        this.currentView++;
        this.render(nextView);

      }

    });

    return AudioView;

});