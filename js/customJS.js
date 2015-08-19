"use strict";

//Global variables

//Number of videos -1
var numberOfVideos = 5;

//Number of pictures in gallery -1
var numberOfPictures = 21;

//Images source
//var imagesPath = "img/photography/";

function hideCarouselControls() {
    var carouselControls = document.getElementsByClassName('carousel-control');
    
       for(var i=0;i<carouselControls.length;i++){
    carouselControls[i].style.visibility= 'hidden';
}
    
}

function showCarouselControls() {
    var carouselControls = document.getElementsByClassName('carousel-control');
    
       for(var i=0;i<carouselControls.length;i++){
    carouselControls[i].style.visibility= 'visible';
}
    
}


$(window).load( function() {
    
    
    // Init Masonry grid
    var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    gutter: '.gutter-sizer',
    columnWidth: '.grid-sizer',
    transitionDuration: '0.4s',
    isAnimated: true
  });
    
    
    // layout Masonry grid after each image loads
    $grid.imagesLoaded().progress( function() {
    $grid.masonry();
  }); 

    /*
    $grid.on( 'click', '.grid-item', function() {
    // change size of item via class
    $( this ).toggleClass('grid-item--gigante');
    // trigger layout
    $grid.masonry('layout');
  });
  */
   
    
});




$(document).ready(function(){
    
    var documentoryCarousel = $("#documentoryCarousel");
    var videography = $("#videographyNav");
    var modalImage = $('#modalImage');
    
    
    // Activate Carousel
    documentoryCarousel.carousel({interval: 4000});

    //Click handlers for video thumbnails
    for(var i=0;i<numberOfVideos;i++){
        $( "#" + i).click(function() {
            documentoryCarousel.carousel(parseInt($(this).attr('id'),10));
            documentoryCarousel.carousel('pause');
            videography.click();
        });
    }
    
        //Click handlers for picture thumbnails
    for(var i=0;i<numberOfPictures;i++){
        $( "#photo-" + i).click(function() {
            //var src = imagesPath + "photo" + i ;
            var str = $(this).attr("id");
            var array = str.split('-');
            modalImage.attr("src", $("#image" + array[1]).attr("src"));
        });
    }
    
});



// VIMEO adding event listeners for pause and play of multiple videos using API 
$(function() {
    var player = $('iframe');
    var playerOrigin = '*';
    

    // Listen for messages from the player
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    }
    else {
        window.attachEvent('onmessage', onMessageReceived, false);
    }

    // Handle messages received from the player
    function onMessageReceived(event) {
        // Handle messages from the vimeo player only
        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
            return false;
        }
        
        if (playerOrigin === '*') {
            playerOrigin = event.origin;
        }
        
        
        var data = JSON.parse(event.data);
        
        switch (data.event) {
            case 'ready':
                onReady();
                break;
               
            case 'play':
                play();
                break;
                
            case 'pause':
                onPause();
                break;
               
        }
    }

    // Call the API when a button is pressed
    $('button').on('click', function() {
        post($(this).text().toLowerCase());
    });

    // Helper function for sending a message to the player
    function post(action, value) {
        var data = {
          method: action
        };
        
        if (value) {
            data.value = value;
        }
        
        var message = JSON.stringify(data);
        
              for (var i = 0, length = player.length; i < length; i++) {
                player[i].contentWindow.postMessage(data, playerOrigin);
            }
            
    }

    function onReady() {
        post('addEventListener', 'pause');
        post('addEventListener', 'play');
    }

    function onPause() {
          showCarouselControls();
        $("#documentoryCarousel").carousel("cycle");
    }

    function play() {
          hideCarouselControls();
        $("#documentoryCarousel").carousel("pause");
    }
});