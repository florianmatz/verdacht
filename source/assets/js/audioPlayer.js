define([
  'jquery',
  'underscore',
  'tpl!../templates/player.template',
  'utils'
  ], function($, _, template, utils){

    /**
     * Class to load background images depending on the current viewport
     * @class AudioPlayer
     */
    AudioPlayer = function(file) {

      this.$el = $(template());

      this.$window = $(window);

      this.filePath = 'assets/sounds/';

      this.file = file;

      this.$loader = this.$el.find('.loader');

      this.$playback = this.$el.find('.playback');

      this.$currentTime = this.$el.find('.time-current');

      this.$playbackHead = this.$playback.find('.head');

      this.$playbackBar = this.$playback.find('.bar');

      this.$playbackBarCurrent = this.$playbackBar.find('.bar-current');

      this.$volume = this.$el.find('.volume');

      this.$volumeHead = this.$volume.find('.head');

      this.$volumeBar = this.$volume.find('.bar');

      this.$volumeBarCurrent = this.$volumeBar.find('.bar-current');

      this.$toggler = this.$el.find('.toggler');

      this.dragging = '';

      this.init();

    };

    AudioPlayer.prototype.init = function() {
      this.addInterfaceListeners();
      this.initAudio();
    };

    AudioPlayer.prototype.addInterfaceListeners = function() {

      // Playback
      // --------------------------
      this.$playback.on('changed', $.proxy( this.seek, this) );
      this.$playbackHead.on('mousedown', $.proxy( this.startDrag, this) );
      this.$playbackBar.on('click', $.proxy( this.setBar, this) );

      // Volume
      // --------------------------
      this.$volume.on('changed', $.proxy( this.changeVolume, this ) );
      this.$volume.find('a').on('click', $.proxy( this.stepVolume, this) );
      this.$volumeHead.on('mousedown', $.proxy( this.startDrag, this) );
      this.$volumeBar.on('click', $.proxy( this.setBar, this) );

      // Toggler
      // --------------------------
      this.$toggler.on('click', $.proxy( this.togglePlayback, this ) );

    };

    AudioPlayer.prototype.initAudio = function() {
      this.sound = new Audio();
      this.$sound = $(this.sound);
      this.sound.preload = 'metadata';

      if(this.sound.canPlayType("audio/mp3")) {
         this.sound.src = this.filePath+this.file+'.mp3';
      }
      else if(audio.canPlayType("audio/ogg")) {
        //audio.src = "/my-podcast.ogg";
      }

      if(window.sessionStorage) {
        this.setSavedVolume(sessionStorage.getItem('volume'));
      }

      this.initAudioListeners();
    };

    AudioPlayer.prototype.initAudioListeners = function() {

      this.$sound.on('loadedmetadata', $.proxy( this.setTotalTime, this ));
      this.$sound.on('canplay', $.proxy( this.startPlayback, this ));
      this.$sound.on('timeupdate', $.proxy( this.updateTime, this ));
      this.$sound.on('waiting', $.proxy( this.onBuffering, this ));
      this.$sound.on('ended', $.proxy( this.onPlaybackEnd, this ));
    };

    AudioPlayer.prototype.setTotalTime = function() {
      this.totalTime = this.sound.duration;
      var convertedTime  =  this.convertSeconds(this.sound.duration);
      timeString = convertedTime.minutes + ':' + convertedTime.seconds;
      this.$el.find('.time-total').html(timeString);
    };

    AudioPlayer.prototype.startPlayback = function() {
      this.sound.play();
      this.$loader.removeClass('show');
      this.$el.removeClass('loading');
    };

    AudioPlayer.prototype.updateTime = function() {
      var currentTime      =  this.convertSeconds(this.sound.currentTime),
          timeString       = currentTime.minutes+':'+currentTime.seconds,
          percentagePlayed = 100 / this.totalTime * this.sound.currentTime;

      this.$currentTime.html(timeString);
      this.$loader.removeClass('show');

      if(!this.dragging.length) {
        this.$playbackHead.css('left', percentagePlayed+'%');
        this.$playbackBarCurrent.css('width', percentagePlayed+'%');
      }

    };

    AudioPlayer.prototype.togglePlayback = function(evt) {

      evt.preventDefault();

      if(this.sound.paused) {
        this.togglePlaybackIcon();
        this.sound.play();
      }else {
        this.togglePlaybackIcon('pause');
        this.sound.pause();
      }

    };

    AudioPlayer.prototype.togglePlaybackIcon = function(mode) {

      var $icon = this.$toggler.find('div');

      if(mode==='pause') {
        $icon
          .removeClass('icon-pause')
          .addClass('icon-play');
      }else {
        $icon
          .removeClass('icon-play')
          .addClass('icon-pause');
      }

    };

    AudioPlayer.prototype.seek = function(evt, pos) {
      var position = pos - this.$playbackBar.offset().left;
          percentage = Math.round(100 / this.$playbackBar.width() * position) / 100;
          this.sound.currentTime = this.totalTime * percentage;
    };

    AudioPlayer.prototype.setSavedVolume = function(volume) {
      if(volume) {
        this.sound.volume = volume;
        this.$volumeHead.css('left', volume*100+'px');
        this.$volumeBarCurrent.css('width', volume*100+'px');
      }else {
        this.sound.volume = 1;
      }
    };

    AudioPlayer.prototype.changeVolume = function() {
      this.sound.volume = parseInt(this.$volumeHead.css('left').split('px')[0], 10)/100;
      if(window.sessionStorage) {
        sessionStorage.setItem('volume', this.sound.volume);
      }
    };

    AudioPlayer.prototype.onBuffering = function() {
      this.$loader.addClass('show');
    };

    AudioPlayer.prototype.onPlaybackEnd = function() {
      this.$el.trigger('playbackEnd');
      this.togglePlaybackIcon('pause');
    };

    AudioPlayer.prototype.restart = function() {
      this.sound.currentTime = 0;
      this.sound.play();
      this.togglePlaybackIcon();
    };



    /**
     * Allows handles to be dragged
     * @see Draggable without jqueryUi http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
     * @method startDrag
     * @param  {MouseEvent} evt MousEvent
     */
    AudioPlayer.prototype.startDrag = function(evt) {

      this.$window.on('mouseup.audioplayer', $.proxy( this.stopDrag, this) );

      var $el         = $(evt.currentTarget),
          $bar        = $el.parent(),
          $barCurrent = $bar.find('.bar-current'),
          handleWidth = $el.outerWidth(),
          posX        = $el.offset().left - evt.pageX,
          minDrag     = $bar.offset().left,
          maxDrag     = minDrag + $bar.outerWidth() - handleWidth;

      this.dragging = $bar.parent().attr('class');

      $el.parents().on('mousemove', function(evt) {

          var left = evt.pageX + posX + handleWidth;

          left = left < minDrag ? minDrag : left;
          left = left > maxDrag ? maxDrag : left;

          $el.offset({
              left: left
          });

          if( $barCurrent.data('follow') ) {
            $barCurrent.css('width', $el.css('left'));
          }

      });
      evt.preventDefault();
    };

    /**
     * Stops dragging of handles
     * @method stopDrag
     */
    AudioPlayer.prototype.stopDrag = function(evt) {
      this.$window.off('mouseup.audioplayer');
      $('.'+this.dragging).trigger('changed', [evt.pageX]);
      this.dragging = '';
      this.$playbackHead.add(this.$volumeHead)
        .parents().off('mousemove');
    };

    AudioPlayer.prototype.setBar = function(evt) {
      evt.preventDefault();

      var $el         = $(evt.currentTarget),
          $head       = $el.find('.head'),
          $barCurrent = $el.find('.bar-current'),
          offset      = evt.pageX - $el.offset().left,
          initiator   = $el.parent().attr('class');

      $barCurrent.width(offset);
      $head.css('left', offset);
      $('.'+initiator).trigger('changed', [evt.pageX]);

    };

    AudioPlayer.prototype.stepVolume = function(evt) {
      evt.preventDefault();

      var $el           = $(evt.currentTarget),
          leading       = $el.data('volume') === 'dec' ? -1 : 1,
          step          = leading * 10,
          maxVolume     = this.$volumeBar.width(),
          minVolume     = 0,
          currentVolume = parseInt(this.$volumeHead.css('left').split('px')[0], 10),
          newVolume     = currentVolume + step;

      newVolume = newVolume < minVolume ? 0 : newVolume;
      newVolume = newVolume > maxVolume ? maxVolume : newVolume;

      this.$volumeHead.css('left', newVolume + 'px');
      this.$volumeBarCurrent.css('width', newVolume + 'px');
      this.$volume.trigger('changed');

    };

    AudioPlayer.prototype.convertSeconds = function(time) {

      var hours   = Math.floor(time / 3600);
      time        = time - hours * 3600;
      var minutes = Math.floor(time/60),
          seconds = Math.floor(time - minutes * 60);

      return {
        hours  : this.zPad(hours),
        minutes: this.zPad(minutes),
        seconds: this.zPad(seconds)
      };

    };

    AudioPlayer.prototype.zPad = function(num, size) {
        if(!size) size = 2;
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    };

    return AudioPlayer;
});