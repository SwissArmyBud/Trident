console.log("JS Ready!");

var _haltEvent = function(event){
  event.preventDefault();
  event.stopPropagation();
};

var loadStoplightJS = function(){
  // BASIC NEXT VALUE MAP
  var light_cycle = {
    "green": "yellow",
    "yellow": "red",
    "red": "green"
  };
  // TURN OFF ALL THE LIGHTS
  var _turnOffLights = function(){
    $(".light.bulb").addClass("off");
  };
  // STOP EVENT AND CYCLE LIGHT
  var _cycleHandler = function(event){
    _haltEvent(event);
    var next = light_cycle[ $(".light.bulb:not(.off)")[0].classList[2] ];
    _turnOffLights();
    $(".light.bulb." + next).removeClass("off");
  };
  // ASSIGN CLICK HANDLER TO BUTTON
  $("#light_cycler").on("click", _cycleHandler);
  // ASSIGN CLICK HANDLER TO BULBS
  $(".light.bulb").each(function(idx, el){
    $(el).on("click", function(event){
      _haltEvent(event);
      _turnOffLights();
      $(el).removeClass("off");
    });
  });
};

var loadFerrisWheelJS = function(){
  var _cycleHandler = function(event){
    _haltEvent(event);
    var ferrisWheel = $("#ferris_wheel");
    var cycled = $(ferrisWheel).children()[0];
    $(cycled).detach(); // `detach` retains event handler bindings
    $($(cycled).children()[1]).text(Math.floor((Math.random() * 30) + 20));
    var childs = $(ferrisWheel).children();
    $(cycled).insertAfter($(childs).get(-1));
  };
  $("#ferris_cycler").on("click", _cycleHandler);
  $("#ferris_wheel tr").each(function(idx, el){
    $(el).on("click", function(event){
      _haltEvent(event);
      var nameCell = $(el).children()[0];
      alert( $(nameCell).text() + " says hello!" );
    });
  });
};

$(function() {
  console.log("Framework loaded!");
  loadStoplightJS();
  loadFerrisWheelJS();
});
