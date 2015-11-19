'use strict'
;(function ($) {
  var WIDTH = 320 
  var HEIGHT = 240
  $('#boxel').hide()

  $('#room').keyup(function (event) {
    if (event.keyCode == 13) {
      var url = $('#url').val()
      var realm = $('#room').val()
      
      var conn = new autobahn.Connection({
          url: 'ws://' + url + '/ws',
          realm: realm
      })

      conn.onopen = function (session) {
        notie.alert(1, 'Success!', 1.5);

        var cameraStats = new Stats()
        cameraStats.setMode(0)
        cameraStats.domElement.style.left = '20px'

        var boxelStats = new Stats()
        boxelStats.setMode(0)
        boxelStats.domElement.style.left = '20px'

        $('#channel').hide()
        $('body').css("background-color", "white");
        $('#boxel').show()
        $('#boxel').append("<div class=\"col-md-12\">" 
            + "<div class=\"col-lg-6\">" 
            + "<div class=\"panel panel-default\">" 
            + "<div class=\"panel-heading\">Normal Video</div>" 
            + "<div class=\"panel-body\" id=\"normal\">"
            + "<canvas id=\"player\" autoplay=\"true\" width=\"640\" height=\"480\"></canvas>" 
            + "</div></div></div>" 
            + "<div class=\"col-lg-6\">" 
            + "<div class=\"panel panel-default\">" 
            + "<div class=\"panel-heading\">Boxelized Video</div>" 
            + "<div class=\"panel-body\" id=\"boxelized\">" 
            + "<canvas id=\"boxelPlayer\" autoplay=\"true\" width=\"640\" height=\"480\"></canvas>"
            + "</div></div></div></div>")

        $('#normal').append(cameraStats.domElement)
        $('#boxelized').append(boxelStats.domElement)

        var boxelCanvas = $('#boxelPlayer')
        var cxt = boxelCanvas[0].getContext('2d')

        camera.init({
          width: WIDTH,
          height: HEIGHT,
          fps: 20,
          mirror: true,
          targetCanvas: document.getElementById('player'),
          onFrame: function (canvas) {
            var update = function () {
              cameraStats.begin()
              var b64jpeg = canvas.toDataURL("image/jpeg")
              session.call('com.boxel.stream', [realm, b64jpeg]).then(onVideoStream)
              cameraStats.end()
            }
            requestAnimationFrame(update)
          },

          onSuccess: function (stream) {
            // stream succesfully started, yay!
          },

          onError: function (error) {
            // something went wrong on initialization
          },
          
          onNotSupported: function () {
            // instruct the user to get a better browser
          }
        })
        
        function onVideoStream (e) {
          var update = function () {
            boxelStats.begin()
            var img = new Image()
            img.src = "data:image/jpeg;base64," + e
            cxt.drawImage(img, 0, 0, 640, 480)
            boxelStats.end()
          }
          requestAnimationFrame(update)
        }
      }

      conn.onclose = function (reason, details) {
        console.log(reason) 
        notie.alert(3, 'Error: ' + reason , 2.5)
      }
      conn.open()
    }
  })
})(jQuery)
    

