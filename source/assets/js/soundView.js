define([
  'jquery',
  'underscore',
  'backbone',
  'tpl!../templates/sound.template',
  'utils'
  ], function($, _, Backbone, template, utils){

    /**
     * View to play the destinctive Chapters of the audio-drama
     * @class SoundView
     */
    SoundView = Backbone.View.extend({

      /**
       * @property {String} className Class Name of the view's DOM-Object
       */
      className: 'chapter',

      /**
       * @property {String} filePath The path to the sounds
       */
      filePath: 'assets/sounds/',

      /**
       * @property {Object} events Events binded to the view
       */
      events: {
        'click .replay' : 'replay'
      },

      /**
       * Get it rolling
       * @method initialize
       */
      initialize: function(options) {
        this.player = options.player;
        this.parent = options.parent ? options.parent : null;
      },

      /**
       * Get it rolling
       * @param {String} chapter The current chapter of the audio drame
       * @method render
       */
      render: function(chapter) {

        this.model.attributes.chapter = chapter;
        this.$el.html(template(this.model.attributes));
        this.$decisions = this.$el.find('.decisions');

        if(this.model.get('loop')) {
          this.initLoop();
        }

        if(this.model.get('sms')==='receive') {
          this.initMessage();
        }

        if(!this.model.get('nofile')){
          this.$player = this.player.$el;

          if(this.model.get('end')) {
            this.playEnd();
          }
          else {
            this.$player.one('playbackEnd', $.proxy( this.showDecision, this ));
            this.player.setFile(this.model.get('name'));
          }

          this.$player.show();
          this.$el
            .find('.placeholder-player')
            .replaceWith(this.$player);
        }
        else {
          this.showDecision();
        }

        return this;
      },

      /**
       * Replays the current chapter
       * @method replay
       * @param  {event} evt MouseEvent
       */
      replay: function(evt) {
        evt.preventDefault();
        this.stopLoop();
        this.$decisions.addClass('out');
        this.$player.one('playbackEnd', $.proxy( this.showDecision, this ));
        this.$player.show();
        this.player.restart();
      },

      /**
       * Shows the decision buttons after the chapter end
       * @method showDecision
       */
      showDecision: function() {

        // At the cellar, no decision neccessary
        if(this.model.get('paths') && this.model.get('paths')[0]==='end') {
          this.parent.proceed('end');
        }else {
          if(this.$player) {
            this.$player.hide();
          }
          this.$decisions.removeClass('out');
          this.playLoop();
          this.playMessage();
        }

      },

      /**
       * Init the loop sound file, which is played during the decisions
       * @method initLoop
       * @param {String} custom Potential custom loop to play
       */
      initLoop: function(custom) {

        this.loop = new Audio();
        this.loop.loop = true;

        var path = this.filePath;
        path+= custom ? custom : this.model.get('loop');

        if(this.loop.canPlayType("audio/mp3")) {
           this.loop.src = path+'.mp3';
        }
        else if(this.loop.canPlayType("audio/ogg")) {

        }
      },

      /**
       * Plays the loop
       * @method playLoop
       */
      playLoop: function() {

        if(!this.loop) return;

        if(window.sessionStorage) {
          var volume = sessionStorage.getItem('volume');
          if(volume) {
            this.loop.volume = volume;
          }else {
            this.loop.volume = 1;
          }
        }

        this.loop.play();
      },

      /**
       * Stops the loop
       * @method stopLoop
       */
      stopLoop: function() {
        if(!this.loop) return;
        this.loop.pause();
      },

      /**
       * Init the message sound file, which is played when a sms is received during the audio drama.
       * Also used for playing the outro when the audio drama has ended.
       * @method initLoop
       * @param {String} custom Potential custom message to play
       */
      initMessage: function(custom) {

         this.message = new Audio();

         var path = this.filePath;
         path+= custom ? custom : 'message';

         if(this.message.canPlayType("audio/mp3")) {
            this.message.src = path+'.mp3';
         }
         else if(this.message.canPlayType("audio/ogg")) {

         }
       },

      /**
       * Plays the message
       * @method playMessage
       */
      playMessage: function() {

        if(!this.message) return;

        if(window.sessionStorage) {
          var volume = sessionStorage.getItem('volume');
          if(volume) {
            this.message.volume = volume;
          }else {
            this.message.volume = 1;
          }
        }

        this.message.play();
      },

      /**
       * Stops the message
       * @method stopMessage
       */
      stopMessage: function() {
        if(!this.message) return;
        this.message.pause();
        this.message.currentTime = 0;
      },

      /**
       * Plays the ending of the audio drama which consists of two parts and depends
       * on the places you have visited during the drama, and shows the credits
       * @method playEnd
       */
      playEnd: function() {

        this.$player.one('playbackEnd', $.proxy( function() {

          var $h2 = this.$el.find('h2'),
              $credits = $('.credits'),
              $list    = $credits.find('dl'),
              $btn     = $credits.find('.total-replay'),
              $sounds  = $('.sounds');

          $h2.find('span:nth-of-type(2)').text('Das Krankenhaus');

          this.$player.one('playbackEnd', $.proxy( function() {

            this.initMessage(this.outro);
            this.playMessage();

            // Configure the total replay button
            $btn.on('click', $.proxy(function(evt){
              this.stopMessage();
            }, this));

            $btn.on('click', $.proxy(this.parent.totalReplay, this.parent));

            // Show the credits
            $sounds.css('display', 'none');
            $credits
              .show();
            $list.addClass('animate');
            $list.on(utils.prefixedAnimationEnd, function() {
              $list.off(utils.prefixedAnimationEnd);
              $list.hide();
              $btn.addClass('in');
            });


          }, this) );

          this.player.setFile(this.endingPartB);

        }, this));

        this.player.setFile(this.endingPartA);

      }

    });

    return SoundView;

});