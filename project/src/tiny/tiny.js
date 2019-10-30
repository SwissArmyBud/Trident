console.log("JS Ready!");

$(function() {
    console.log("Framework loaded!");
    $("#home_button").on("click", function(event){
      window.location = "/index.html";
    });
    $("#alert_button").on("click", function(event){
      alert("You clicked the button!");
    });
});
