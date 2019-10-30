console.log("JS Ready!");

$(function() {
    console.log("Framework loaded!");
    $("#demo_button").on("click", function(event){
      window.location = "/demo.html";
    });
    $("#tiny_button").on("click", function(event){
      window.location = "/tiny.html";
    });
    $("#static_button").on("click", function(event){
      window.location = "/static.html";
    });
});
