define([
  'jquery',
  'underscore',
  'backbone',
  'soundView',
  'json!../json/sounds.json',
  'utils',
  'audioPlayer'
  ], function($, _, Backbone, soundView, json, utils, AudioPlayer){


    AudioView = Backbone.View.extend({

      el: $('#audio .sounds'),
      events: {
        'click .proceed'      : 'proceed',
        'click .total-replay' : 'totalReplay'
      },
      transitionEnd: utils.prefixedTransitionEnd,
      soundViews: [],
      currentChapter: 0,
      bitmaskA: 0 | 0 | 0,
      bitmaskB: 0 | 0 | 0,

      initialize: function() {
        this.player = new AudioPlayer();
        this.createSounds();
      },

      createSounds: function() {

        _.each(json.sounds, function(item){

          var model = new Backbone.Model(item),
              view  = new SoundView({
                model: model,
                player: this.player
              });

          this.soundViews.push(view);

        }, this);

      },

      render: function(nextView) {

        if(nextView) {

          this.$el.one(this.transitionEnd, $.proxy( function() {
            this.$el.off(this.transitionEnd);
            this.renderSoundView(nextView);
            this.currentView.remove();
            this.currentView = nextView;
          }, this ));

          this.$el.addClass('fading');

        }else {
          // At audio start
          this.renderSoundView(this.soundViews[0]);
          this.currentView = this.soundViews[0];
        }

        return this;
      },

      renderSoundView: function(view) {
        this.$el
          .off(this.transitionEnd)
          .html(view.render(this.currentChapter+1).$el)
          .removeClass('fading');
      },

      proceed: function(evt) {
        evt.preventDefault();

        this.currentView.stopLoop();

        var nextSound = $(evt.currentTarget).data('next'),
            nextView  = _.find(this.soundViews, function(soundView) { return soundView.model.get('name')===nextSound; }),
            bitmask   = nextView.model.get('bitmask'),
            paths     = nextView.model.get('paths');

        // set corresponding bitmask
        if(bitmask) {
          this['bitmask'+bitmask] |= nextView.model.get('flag');
        }

        // Dummy to come to the very end from the cellar automatically, replace with sound events
        if(paths && paths.length === 1 && paths[0]==='end') {
          nextView = _.last(this.soundViews);
        }

        // Select the correct endings A+B depending on the bitmasks
        if(nextView.model.get('end')){
          nextView.endingPartA = 'ending-a-'+this.bitmaskA;
          nextView.endingPartB = 'ending-b-'+this.bitmaskB;
          nextView.outro = 'outro';
        }

        this.currentChapter++;
        this.render(nextView);

      },

      totalReplay: function(evt) {
        this.currentChapter = this.bitmaskA = this.bitmaskB = 0;
        this.render();
      }


    });

    return AudioView;

});