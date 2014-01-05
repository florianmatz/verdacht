define([
  'jquery',
  'underscore',
  'tpl!../templates/player.template'
  ], function($, _, template){

    /**
     * Class to load background images depending on the current viewport
     * @class AudioPlayer
     */
    AudioPlayer = function(file) {

      this.$el = $(template());

      this.$window = $(window);

      this.filePath = 'assets/sounds/';

      this.file = file;

      console.log(file);

      this.$playback = this.$el.find('.playback');

      this.$playHead = this.$playback.find('.head');

      this.$playBar = this.$playback.find('.bar');

      this.$volume = this.$el.find('.volume');

      this.$volumeHead = this.$volume.find('.head');

      this.$volumeBar = this.$volume.find('.bar');

      this.dragged = '';

      this.init();

    };

    AudioPlayer.prototype.init = function() {
      this.addListeners();
      this.initAudio();
    };

    AudioPlayer.prototype.initAudio = function() {
      this.audio = new Audio();
      console.log(this.audio);
      if(this.audio.canPlayType("audio/mp3"))
         this.audio.src = this.filePath+this.file+'.mp3';
      // else if(audio.canPlayType("audio/ogg"))
      //    audio.src = "/my-podcast.ogg";
      //this.audio.play();
    };

    AudioPlayer.prototype.addListeners = function() {

      // Playback
      // --------------------------
      this.$playHead.on('mousedown', $.proxy( this.startDrag, this) );

      this.$playBar.on('click', $.proxy( this.setBar, this) );

      // Volume
      // --------------------------
      this.$volume.on('changed', function(evt) {
          // vol changed
      });

      this.$volume.find('a').on('click', $.proxy (this.stepVolume, this) );

      this.$volumeHead
        .on('mousedown', $.proxy( this.startDrag, this) );

      this.$volumeBar.on('click', $.proxy( this.setBar, this) );


    };

    /**
     * Allows handles to be dragged
     * @see Draggable without jqueryUi http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
     * @method startDrag
     * @param  {MouseEvent} evt MousEvent
     */
    AudioPlayer.prototype.startDrag = function(evt) {

      this.$window.on('mouseup.audioplayer', $.proxy( this.stopDrag, this) );

      var $el       = $(evt.currentTarget),
          $bar        = $el.parent(),
          $barCurrent = $bar.find('.bar-current'),
          handleWidth = $el.outerWidth(),
          posX        = $el.offset().left - evt.pageX,
          minDrag     = $bar.offset().left + handleWidth,
          maxDrag     = minDrag + $bar.outerWidth() - handleWidth;

      this.dragged = $bar.parent().attr('class');

      $el.parents().on('mousemove', function(evt) {

          var left = evt.pageX + posX;

          if(left > minDrag && left < maxDrag) {

            $el.offset({
                left: evt.pageX + posX - handleWidth
            });
          }

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
    AudioPlayer.prototype.stopDrag = function() {

      this.$window.off('mouseup.audioplayer');

      // throw event, for volume or playback change
      $('.'+this.dragged).trigger('changed');
      this.dragged = '';

      this.$playHead.add(this.$volumeHead)
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
      $('.'+initiator).trigger('changed');

    };


    AudioPlayer.prototype.stepVolume = function(evt) {
      evt.preventDefault();

      var $el = $(evt.currentTarget),
          $barCurrent = this.$volume.find('.bar-current'),
          leading = $el.data('volume') === 'dec' ? -1 : 1,
          step = leading * 10,
          maxVolume = this.$volumeBar.width(),
          minVolume = 0,
          currentVolume = parseInt(this.$volumeHead.css('left').split('px')[0], 10),
          newVolume = currentVolume + step;

          newVolume = newVolume < minVolume ? 0 : newVolume;
          newVolume = newVolume > maxVolume ? maxVolume : newVolume;

      this.$volumeHead.css('left', newVolume + 'px');
      $barCurrent.css('width', newVolume + 'px');
      this.$volume.trigger('changed');

    };

    return AudioPlayer;
});