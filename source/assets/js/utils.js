define([

], function(){

 Utils = function() {

 };

 Utils.prototype.getViewport = function() {

       var viewport = window.getComputedStyle(
              document.querySelector('body'), ':before'
            ).getPropertyValue('content');

       return viewport;
 };


 return new Utils();

});

