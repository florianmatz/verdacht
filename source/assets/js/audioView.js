define([
  'jquery',
  'underscore',
  'backbone',
  'soundView',
  'json!../json/sounds.json',
  'utils',
  'audioPlayer'
  ], function($, _, Backbone, soundView, json, utils, AudioPlayer){

    /**
     * The main view for the audio drame
     * @class AudioView
     */
    AudioView = Backbone.View.extend({

      /**
       * @property {jQuery} this.el The jQuery Container of the view
       */
      el: $('#audio .sounds'),

      /**
       * @property {Object} this.events The events binded to the view
       */
      events: {
        'click .proceed'      : 'proceed',
        'click .total-replay' : 'totalReplay'
      },

      /**
       * @property {String} this.transitionEnd Vendor-prefixed transition-end events
       */
      transitionEnd: utils.prefixedTransitionEnd,

      /**
       * @property {Array} this.soundViews Holds all the views generated for each chapter
       */
      soundViews: [],

      /**
       * @property {Number} this.currentChapter Indicates the currentChapter
       */
      currentChapter: 0,

      /**
       * @property {Bitmask} this.bitmaskA Bitmask used for calculating the ending part A
       */
      bitmaskA: 0 | 0 | 0,

      /**
       * @property {Bitmask} this.bitmaskB Bitmask used for calculating the ending part B
       */
      bitmaskB: 0 | 0 | 0,

      /**
       * Get it rolling
       * @method initialized
       */
      initialize: function() {
        /**
         * @property {AudioPlayer} this.player Instance of the audio player
         * @type {AudioPlayer}
         */
        this.player = new AudioPlayer();
        this.createSounds();
      },

      /**
       * Create the chapters of the audio drama: create a model + view and put it to a array
       * @method initialized
       */
      createSounds: function() {

        _.each(json.sounds, function(item){

          var model = new Backbone.Model(item),
              view  = new SoundView({
                model: model,
                player: this.player,
                parent: item.paths && item.paths[0]==='end' ? this : null
              });

          this.soundViews.push(view);

        }, this);

      },


      /**
       * Render the view
       * @method render
       * @param {soundView} nextView The next chapter to be rendered
       */
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

      /**
       * Render the current chapter
       * @method renderSoundView
       * @param {soundView} view The chapter to be rendered
       */
      renderSoundView: function(view) {
        this.$el
          .off(this.transitionEnd)
          .html(view.render(this.currentChapter+1).$el)
          .removeClass('fading');
      },

      /**
       * Find the next chapter to be rendered, depending on user input on the decision screen
       * @method proceed
       * @param {MouseEvent} evt MouseEvent of a decision button
       */
      proceed: function(evt) {
        if(typeof evt === 'object') {
          evt.preventDefault();
          nextSound = $(evt.currentTarget).data('next');
        }
        else {
          nextSound = evt;
        }

        this.currentView.stopLoop();

        var nextView  = _.find(this.soundViews, function(soundView) { return soundView.model.get('name')===nextSound; }),
            bitmask   = nextView.model.get('bitmask'),
            paths     = nextView.model.get('paths');

        // Set the bitmask for the ending, if available
        if(bitmask) {
          this['bitmask'+bitmask] |= nextView.model.get('flag');
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

      /**
       * Replay the whole audio drama
       * @method totalReplay
       * @param {MouseEvent} evt MouseEvent of a total replay button
       */
      totalReplay: function(evt) {
        evt.preventDefault();
        this.currentChapter = this.bitmaskA = this.bitmaskB = 0;
        this.render();
      }


    });

    return AudioView;

});