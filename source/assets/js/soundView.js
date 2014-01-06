define([
  'jquery',
  'underscore',
  'backbone',
  'tpl!../templates/sound.template',
  'audioPlayer',
  'utils'
  ], function($, _, Backbone, template, audioPlayer, utils){

    SoundView = Backbone.View.extend({

      className: 'chapter',
      filePath: 'assets/sounds/',

      events: {
        'click .replay': 'replay'
      },

      initialize: function() {
      },

      render: function(chapter) {

        this.model.attributes.chapter = chapter;
        this.$el.html(template(this.model.attributes));
        this.$decisions = this.$el.find('.decisions');

        if(this.model.get('loop')) {
          console.log('init den loop');
          this.initLoop();
        }

        if(this.model.get('sms')==='receive') {
          this.initMessage();
        }

        if(!this.model.get('nofile')){
          this.initPlayer();
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

      initPlayer: function() {
        this.player = new audioPlayer(this.model.get('name'));
        this.$player = this.player.$el;
        this.$player.on('playbackEnd', $.proxy( this.showDecision, this ));
      },

      initLoop: function() {

        this.loop = new Audio();

        this.loop.loop = true;
        if(this.loop.canPlayType("audio/mp3")) {
           this.loop.src = this.filePath+this.model.get('loop')+'.mp3';
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
         else if(this.loop.canPlayType("audio/ogg")) {

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
      }



    });

    return SoundView;

});