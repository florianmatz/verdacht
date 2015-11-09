define([
  'jquery',
  'underscore',
  'tpl!../templates/player.template',
  'utils'
  ], function($, _, template, utils){

    /**
     * A simple AudioPlayer
     * @class AudioPlayer
     */
    AudioPlayer = function(file) {

      /**
       * @property {jQuery} this.$el Element of the compiled player template
       */
      this.$el = $(template());

      /**
       * @property {jQuery} this.$window window
       */
      this.$window = $(window);

      /**
       * @property {string} this.filePath Path to the sound files
       */
      this.filePath = 'assets/sounds/';

      /**
       * @property {string} this.file Filename of the sound
       */
      this.file = file;

      /**
       * @property {jQuery} this.$loader The Loader
       */
      this.$loader = this.$el.find('.loader');

      /**
       * @property {jQuery} this.$playback The container of the playback Element
       */
      this.$playback = this.$el.find('.playback');

      /**
       * @property {jQuery} this.$currentTime Element which shows the currentTime of the file
       */
      this.$currentTime = this.$el.find('.time-current');

      /**
       * @property {jQuery} this.$playbackHead The Element which indicates the current playback position
       */
      this.$playbackHead = this.$playback.find('.head');

      /**
       * @property {jQuery} this.$playbackBar The PlaybackBar
       */
      this.$playbackBar = this.$playback.find('.bar');

      /**
       * @property {jQuery} this.$playbackBarCurrent The bar which indicates the current playback position as a bar
       */
      this.$playbackBarCurrent = this.$playbackBar.find('.bar-current');

      /**
       * @property {jQuery} this.$volume Container for all the volume elements
       */
      this.$volume = this.$el.find('.volume');

       /**
       * @property {jQuery} this.$volumeHead Element which indicates the current volume
       */
      this.$volumeHead = this.$volume.find('.head');

      /**
       * @property {jQuery} this.$volumeBar The bar which shows the possible volumes
       */
      this.$volumeBar = this.$volume.find('.bar');

      /**
      * @property {jQuery} this.$volumeBarCurrent Element which indicates the current volume as a bar
      */
      this.$volumeBarCurrent = this.$volumeBar.find('.bar-current');

      /**
      * @property {jQuery} this.$toggler Element to start/stop the playback
      */
      this.$toggler = this.$el.find('.toggler');

      /**
      * @property {jQuery} this.$togglerIcon Element which holds the corresponding icon
      */
      this.$togglerIcon = this.$toggler.find('div');

      /**
      * @property {Boolean} this.onMobile Flag, if playback is on mobile
      */
      this.onMobile = utils.onMobile();

      /**
      * @property {Boolean} this.isTouch Flag, if playback is on touch device
      */
      this.onTouchDevice = utils.isTouch();

      /**
      * @property {Boolean} this.dragging Flag that indicates if a bar is dragged
      */
      this.dragging = '';


    };

    /**
     * Sets the file to play
     * @method setFile
     * @param {String} filename The File(name) to be played
     */
    AudioPlayer.prototype.setFile = function(file) {
      this.addInterfaceListeners();
      this.file = file;
      this.initAudio();
    };

    /**
     * Helper to remove all binded listeners before starting a new playback
     * @method removeInterFaceListeners
     */
    AudioPlayer.prototype.removeInterFaceListeners = function() {

      var $elements = [this.$playback, this.$playbackHead, this.$playbackBar, this.$volume, this.$volumeHead, this.$volumeBar, this.$toggler];

      $.each($elements, function(index, $item) {
        $item.unbind();
      });

    };

    /**
     * Adds all the necessary interface listeners
     * @method addInterfaceListeners
     */
    AudioPlayer.prototype.addInterfaceListeners = function() {

      // Kill old Listeners
      this.removeInterFaceListeners();

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

    /**
     * Initializes the html5 audio api
     * @method initAudio
     */
    AudioPlayer.prototype.initAudio = function() {

      if(!this.sound) {
        this.sound = new Audio();
        this.$sound = $(this.sound);
        this.sound.preload = 'auto';
        this.initAudioListeners();
      }

      if(this.sound.canPlayType('audio/mp3')) {
        this.sound.src = this.filePath+this.file+'.mp3';
      }
      else if(audio.canPlayType('audio/ogg')) {
        //audio.src = "/my-podcast.ogg";
      }

      if(window.sessionStorage) {
        this.setSavedVolume(sessionStorage.getItem('volume'));
      }


    };

    /**
     * Initializes the neccessary listeners for the playback
     * @method initAudioListeners
     */
    AudioPlayer.prototype.initAudioListeners = function() {
      this.$sound.unbind();
      this.$sound.on('loadedmetadata', $.proxy( this.getTotalTime, this ));

      if(this.onTouchDevice){
        this.togglePlaybackIcon('pause');
        this.$loader.removeClass('show');
        this.$el.removeClass('loading');
      }else {
        this.togglePlaybackIcon('play');
        this.$sound.on('canplay', $.proxy( this.startPlayback, this ));
      }

      this.$sound.on('timeupdate', $.proxy( this.updateTime, this ));
      this.$sound.on('waiting', $.proxy( this.onBuffering, this ));
      this.$sound.on('ended', $.proxy( this.onPlaybackEnd, this ));
    };

    /**
     * Gets the total time of the playback and writes it to the corresponding DOM-Elements
     * @method getTotalTime
     */
    AudioPlayer.prototype.getTotalTime = function() {
      this.totalTime = this.sound.duration;
      var convertedTime  =  this.convertSeconds(this.sound.duration);
      timeString = convertedTime.minutes + ':' + convertedTime.seconds;
      this.$el.find('.time-total').html(timeString);
    };

    /**
     * Start the playback: Remove loaders and start the sound
     * @method startPlayback
     */
    AudioPlayer.prototype.startPlayback = function() {
      this.sound.play();
      this.$loader.removeClass('show');
      this.$el.removeClass('loading');
    };

    /**
     * Update the currentTime, listening to the timeupdate event
     * @method updateTime
     */
    AudioPlayer.prototype.updateTime = function() {

      if(this.totalTime === 0) {
        this.getTotalTime();
      }else if(this.onMobile) {
        this.togglePlaybackIcon('play');
      }

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

    /**
     * Start or Stop the sound playback
     * @method togglePlayback
     * @param {MouseEvent} evt The MouseEvent of the Toggler-Button
     */
    AudioPlayer.prototype.togglePlayback = function(evt) {

      evt.preventDefault();

      if(this.sound.paused) {
        this.togglePlaybackIcon('play');
        this.sound.play();
      }else {
        this.togglePlaybackIcon('pause');
        this.sound.pause();
      }

    };

    /**
     * Change the playback icon
     * @method togglePlaybackIcon
     */
    AudioPlayer.prototype.togglePlaybackIcon = function(mode) {

      if(mode==='pause' && !this.$togglerIcon.hasClass('icon-play')) {
        this.$togglerIcon
          .removeClass('icon-pause')
          .addClass('icon-play');
      }else if(mode==='play' && !this.$togglerIcon.hasClass('icon-pause') ) {
        this.$togglerIcon
          .removeClass('icon-play')
          .addClass('icon-pause');
      }

    };

    /**
     * Jump within the playback
     * @param  {Event} evt MouseEvent
     * @param {Number} pos The position of the event
     */
    AudioPlayer.prototype.seek = function(evt, pos) {
      var position = pos - this.$playbackBar.offset().left;
          percentage = Math.round(100 / this.$playbackBar.width() * position) / 100;
          this.sound.currentTime = this.totalTime * percentage;
    };

    /**
     * Set the volume, which was saved before again
     * @method  setSavedVolume
     */
    AudioPlayer.prototype.setSavedVolume = function(volume) {
      if(volume) {
        this.sound.volume = volume;
        this.$volumeHead.css('left', volume*100+'px');
        this.$volumeBarCurrent.css('width', volume*100+'px');
      }else {
        this.sound.volume = 1;
      }
    };

    /**
     * Change the volume and save the value to the sessionStorage, if available
     * @method  changeVolume
     */
    AudioPlayer.prototype.changeVolume = function() {
      this.sound.volume = parseInt(this.$volumeHead.css('left').split('px')[0], 10)/100;
      if(window.sessionStorage) {
        sessionStorage.setItem('volume', this.sound.volume);
      }
    };

    /**
     * Show loader, when file is buffering
     * @method  onBuffering
     */
    AudioPlayer.prototype.onBuffering = function() {
      this.$loader.addClass('show');
    };

    /**
     * Trigger a custom event, when playback has ended
     * @method onPlaybackEnd
     */
    AudioPlayer.prototype.onPlaybackEnd = function() {

      if(this.onTouchDevice) {
        this.togglePlaybackIcon('pause');
      }
      else {
        this.togglePlaybackIcon('play');
      }

      this.$el.trigger('playbackEnd');
    };

    /**
     * Restart current File
     * @method restart
     */
    AudioPlayer.prototype.restart = function() {
      this.sound.currentTime = 0;
      this.sound.play();
      this.togglePlaybackIcon('play');
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

    /**
     * Set playback bar, when user clicked or dragged on it and trigger a change event
     * @method setBar
     * @param {MouseEvent} evt MouseEvent from clicking the playback bar
     */
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

    /**
     * Increase or decreas playback volume in steps
     * @method stepVolume
     * @param {MouseEvent} evt MouseEvent from clicking the icons
     */
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

    /**
     * Helper to convert seconds to a padded format
     * @method convertSeconds
     * @param  {Number} time Time in seconds of the current playback
     * @return {Object} The converted seconds as a object
     */
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

    /**
     * Helper to convert zero pad a number
     * @method zPad
     * @param  {Number} num The number to be paded
     * @param  {Number} size The size how much the number should be padded
     * @return {String} The padded number
     */
    AudioPlayer.prototype.zPad = function(num, size) {
        if(!size) size = 2;
        var s = num+'';
        while (s.length < size) s = '0' + s;
        return s;
    };

    return AudioPlayer;
});