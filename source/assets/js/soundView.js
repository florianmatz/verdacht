define([
  'jquery',
  'underscore',
  'backbone',
  'tpl!../templates/sound.template',
  'utils'
  ], function($, _, Backbone, template, utils){

    SoundView = Backbone.View.extend({

      className: 'chapter',
      filePath: 'assets/sounds/',

      events: {
        'click .replay' : 'replay'
      },

      initialize: function(options) {
        this.player = options.player;
      },

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
          } else {
            this.$player.one('playbackEnd', $.proxy( this.showDecision, this ));
            this.player.setFile(this.model.get('name'));
          }

          this.$player.show();
          this.$el
            .find('.placeholder-player')
            .replaceWith(this.$player);
        }else {
          this.showDecision();
        }

        return this;
      },

      replay: function(evt) {
        evt.preventDefault();
        this.stopLoop();
        this.$decisions.addClass('out');
        this.$player.one('playbackEnd', $.proxy( this.showDecision, this ));
        this.$player.show();
        this.player.restart();
      },

      showDecision: function() {

        if(this.$player) {
          this.$player.hide();
        }
        this.$decisions.removeClass('out');
        this.playLoop();
        this.playMessage();
      },


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

      stopLoop: function() {
        if(!this.loop) return;
        this.loop.pause();
      },

      initMessage: function() {

         this.message = new Audio();

         if(this.message.canPlayType("audio/mp3")) {
            this.message.src = this.filePath+'message.mp3';
         }
         else if(this.message.canPlayType("audio/ogg")) {

         }
       },

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

      playEnd: function() {

        this.$player.one('playbackEnd', $.proxy( function() {

          var $h2 = this.$el.find('h2');

          $h2.find('span:nth-of-type(2)').text('Das Ende, Teil 2');

          this.$player.one('playbackEnd', $.proxy( function() {
            this.showDecision();
            this.initLoop(this.outro);
            this.playLoop();
          }, this) );

          this.player.setFile(this.endingPartB);

        }, this));

        this.player.setFile(this.endingPartA);

      }



    });

    return SoundView;

});