
function init() {

  // define globals
  os = 0;     // sine offset (float)
  cs = 1;     // starting scene (int)
  ch = $('.container').height(); // container height (depends on viewport width)
  tr = false; // transition right (boolean)
  tl = false; // transition left (boolean)
  la = false; // looking away (boolean)
  lc = 0;     // look away counter (int)
  ll = [];    // sprite list array that holds the letters created in scene 4
  ta = ['Physical', 'Social', 'Spiritual', 'Logical']; // array with the different mood types
  so_sprite_container_list = []; // the sprites for the 'social' scene are stored in this array

  $('header.type').text(ta[cs - 1]); // set type as text in header (-1 because array starts at 0)

  canvas = document.getElementById('myCanvas'); // define canvas
  stage = new createjs.Stage(canvas); // create stage
  createjs.Touch.enable(stage, false, false); // enable touch

  buildScene(); // build up first scene on init

  createjs.Ticker.addEventListener('tick', handleTick); // init ticker
  createjs.Ticker.setFPS(50); // set framerate (how often is handleTick called each second)

  $('.fa-cog').hover(function(){$(this).toggleClass('fa-spin');}); // add hover handler
  $('.fa-bar-chart').click(function(){toggleChart()}); // add click handler
  $('.fa-arrow-circle-o-right').click(function(){if(!tl){tr = true}}); // add click handler
  $('.fa-arrow-circle-o-left').click( function(){if(!tr){tl = true}}); // add click handler

  $(window).scroll(buildScene); // bind to scroll event
  $(window).resize(buildScene); // bind to resize event

}

function toggleChart() {

  $('.barchart_container').toggleClass('active');

  // reset bars
  $("#bars li .bar").each( function(key, bar) {
    $(this).css('height', '0%');
  });

  if($('.barchart_container').hasClass('active')) {
    // animate bars
    $("#bars li .bar").each(function (key, bar) {
      var percentage = $(this).data('percentage');
      $(this).animate({
        'height': percentage + '%'
      }, 1000);
    });
  }

}

function buildScene() {

  // change background colour according to scroll position
  if(getScrollPos() > 0.5){
    $('body, html').css('background', '#cb0008');
  } else {
    $('body, html').css('background', '#8cc63f');
  }

  // clean up scene
  stage.removeAllChildren();
  stage.clear();

  // clean up sprite lists
  for(ti = 0; ti < ll.length; ti++){
    stage.removeChild(ll[ti]);
  }
  for(ti = 0; ti < so_sprite_container_list.length; ti++){
    stage.removeChild(so_sprite_container_list[ti]);
  }
  ll = [];
  so_sprite_container_list = [];

  // get dimension properties
  newWidth  = document.documentElement.clientWidth; // alternatively use window.innerWidth or $(window).width()
  newHeight = document.documentElement.clientHeight;
  var widthToHeight = 1 / 1; // aspect ratio
  var newWidthToHeight = newWidth / newHeight;
  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
  } else { // window height is too high relative to desired viewport
    newHeight = newWidth / widthToHeight;
  }

  // resize canvas to viewport dimensions (with aspect correction)
  var myCanvas    = document.getElementById('myCanvas');
  myCanvas.width  = newWidth;
  myCanvas.height = newHeight;

  // add container object
  container = new createjs.Container();

  // build up scene by scene id
  switch(cs) {

    case 1:

      /* physical */

      // body
      circle = new createjs.Shape();
      circle.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / 3);
      circle.x = newWidth  / 2;
      circle.y = newHeight / 2.1;
      circle.scaleX = circle.scaleY = (getScrollPos() / 4) + 0.8;
      container.addChild(circle);
      // shadow map
      smap = new createjs.Shape();
      smap.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 5);
      smap.x = newWidth  / 2;
      smap.y = newHeight / 1.1;
      smap.scaleY = 0.1;
      smap.alpha  = 0.05;
      stage.addChild(smap);
      // eyes
      eye1 = new createjs.Shape();
      eye1.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 25);
      eye1.x = newWidth   / 2.3;
      eye1.y = (newHeight / 2.45)  + ((newHeight / 1.6) * (getScrollPos() * 0.43));
      eye1.scaleX = eye1.scaleY = (getScrollPos() / 4) + 1;
      eye1.compositeOperation = 'destination-out'; // need reverse winding to cut out the mask from the shape
      container.addChild(eye1);
      eye2   = eye1.clone();
      eye2.x = newWidth  / 1.75;
      container.addChild(eye2);
      // eyelid
      eyelid = new createjs.Shape();
      eyelid.graphics.setStrokeStyle(25).beginStroke('#fff').bezierCurveTo(0, 200, 100, 100, 200, 200);
      eyelid.x = newWidth   / 3.4;
      eyelid.y = (newHeight / 1.8) * (getScrollPos() * 0.55);
      eyelid.scaleX = eyelid.scaleY = (newWidth / 980) * 2;
      container.addChild(eyelid);
      break;

    case 2:

        /* social */

      // body
      circle = new createjs.Shape();
      circle.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / 4);
      circle.x = newWidth  / 2;
      circle.y = newHeight / 2.1;
      container.addChild(circle);

      // first, add a general container and center it to the stage
      so_container = new createjs.Container();
      so_container.x = newWidth / 2;
      so_container.y = newHeight / 2.1;

        // calculate how many sprites (small faces) are needed, according to scroll position
      count = parseInt((1 - getScrollPos()) * 12);
      nr = 360 / count;

      for(so = 0; so < count; so ++) {
        // 2 containers are needed. the first one is the main one that is rotated later ...
        so_offset_container = new createjs.Container();
        so_offset_container.rotation = so * nr;
        so_container.addChild(so_offset_container); // add it to the general container so we can put our 'sprites' inside
        // ... the second one has an offset on the x axis so they properly circle the main circle
        so_sprite_container = new createjs.Container();
        so_sprite_container.x = newWidth / (2.5 + ((1 - getScrollPos()) * 0.8)); // center it on stage
        so_sprite_container.rotation = 0 - (so * nr); // note that this rotation is the invert of the rotation of the main container
        // so_sprite_container.alpha = -0.3;
        so_sprite_container_list.push(so_sprite_container); // add it to spritelist array, this needs to be invert-rotated later aswell
        so_offset_container.addChild(so_sprite_container);  // add it to the general container so 'sprites' can be put inside
        // head
        circle = new createjs.Shape();
        circle.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / 15);
        so_sprite_container.addChild(circle);
        // eyes
        eye1 = new createjs.Shape();
        eye1.graphics.beginFill('#ff0000').drawCircle(0, 0, newWidth / 70);
        eye1.compositeOperation = 'destination-out';
        so_sprite_container.addChild(eye1);
        eye2 = eye1.clone();
        eye1.x -= newWidth / 50;
        eye2.x += newWidth / 50;
        so_sprite_container.addChild(eye2);
      }

      container.addChild(so_container);

      // shadow map
      smap = new createjs.Shape();
      smap.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 5);
      smap.x = newWidth  / 2;
      smap.y = newHeight / 1.1;
      smap.scaleY = 0.1;
      smap.alpha  = 0.05;
      stage.addChild(smap);
      // eyes
      eye1 = new createjs.Shape();
      eye1.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 30);
      eye1.x = newWidth   / 2.3;
      eye1.y = (newHeight / 2.45);
      eye1.scaleX = eye1.scaleY = (getScrollPos() / 4) + 1;
      eye1.compositeOperation = 'destination-out';
      container.addChild(eye1);
      eye2 = eye1.clone();
      eye2.x = newWidth  / 1.75;
      container.addChild(eye2);
      break;

    case 3:

      /* spiritual */

      // body
      circle = new createjs.Shape();
      circle.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / 4);
      circle.x = newWidth   / 2;
      //circle.y = (newHeight / 1.8)  - ((newHeight / 4.5) * ((1 - getScrollPos()) * 0.6));
      circle.y = (newHeight / 1.4)  - ((newHeight / 3.5) * ((1 - getScrollPos()) * 0.9));
      container.addChild(circle);
      // a second circle provides a nice glow (easeljs has no native glow filter)
      glow = new createjs.Shape();
      glow.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / (4.5 - ((1 - getScrollPos()) / 0.9)));
      glow.alpha = 0.2;
      glow.x = newWidth   / 2;
      glow.y = (newHeight / 1.4)  - ((newHeight / 3.5) * ((1 - getScrollPos()) * 0.9));
      container.addChild(glow);
      // subtraction shape that main object can sink into
      hole = new createjs.Shape();
      hole.graphics.setStrokeStyle(125).beginStroke('#ff0000').bezierCurveTo(0, 100, 250, 250, 500, 100);
      hole.x = 0 - newWidth / 50;
      hole.y = (newHeight / 1.4);
      hole.scaleX = hole.scaleY = (newWidth / 980) * 2;
      hole.compositeOperation = 'destination-out';
      container.addChild(hole);
      // polygon star
      star = new createjs.Shape();
      star.graphics.beginFill('#fff').drawPolyStar(0, 0, newWidth / 2, 25, 2, 0);
      star.alpha = 0.5;
      star.x = newWidth   / 2;
      star.y = (newHeight / 1.4)  - ((newHeight / 3.5) * ((1 - getScrollPos()) * 0.9));
      star.scaleX = star.scaleY = (1 - getScrollPos()) / 1.5 + 0.2;
      container.addChild(star);
      // shadow map
      smap = new createjs.Shape();
      smap.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 5);
      smap.x = newWidth  / 2;
      smap.y = newHeight / 1.1;
      smap.scaleX = 1 - (getScrollPos() / 10);
      smap.scaleY = 0.1;
      smap.alpha  = 0.05;
      stage.addChild(smap);
      // eyes
      eye1 = new createjs.Shape();
      eye1.graphics.beginFill('#000').drawCircle(0,0, newWidth / 25);
      eye1.x = newWidth   / 2.3;
      eye1.y = (newHeight / 1.37)  - ((newHeight / 4.5) * ((1 - getScrollPos()) * 1.6));
      eye1.compositeOperation = 'destination-out';
      container.addChild(eye1);
      eye2 = eye1.clone();
      eye2.x = newWidth  / 1.75;
      container.addChild(eye2);
      // eyelid
      eyelid = new createjs.Shape();
      eyelid.graphics.setStrokeStyle(50).beginStroke('#fff').bezierCurveTo(40, 100, 160, 100, 160, 100);
      eyelid.x = newWidth   / 3.4;
      eyelid.y = (newHeight / 1.175)  - ((newHeight / 4.5) * ((1 - getScrollPos()) * 2.6));
      eyelid.scaleX = eyelid.scaleY = (newWidth / 980) * 2;
      eyelid.scaleY = (newWidth / 980) * ((1 - getScrollPos()));
      container.addChild(eyelid);
      break;

    case 4:

      /* logical */


      /* opzet met hersens

      // first, add a general container and center it to the stage
      so_container = new createjs.Container();
      so_container.x = newWidth / 2;
      so_container.y = newHeight / (1.51 - (getScrollPos() / 10));
      // calculate how many sprites (small faces) are needed, according to scroll position
      count = 25;
      for(so = 0; so < count; so ++) {
        // 2 containers are needed. the first one is the main one that is rotated later ...
        so_offset_container = new createjs.Container();
        rr = Math.random() * 60;
        rr = 30 - rr;
        so_offset_container.rotation = rr + 270;
        so_container.addChild(so_offset_container); // add it to the general container so we can put our 'sprites' inside
        // ... the second one has an offset on the x axis so they properly circle the main circle
        so_sprite_container = new createjs.Container();
        so_sprite_container.x = newWidth / 3.3; // center it on stage
        if(rr < 0){ya = rr + 30} else {ya = 30 - rr}
        ycr = ya / (0.8 + (newWidth / 980)); // apply some y correction based on width of viewport and rotation offset of each blob
        so_offset_container.y -= ycr / (((980 / newWidth)) );   // the smaller this random number is, the more 'north' the shape will be orientated. lets correct the y value for this
        so_sprite_container.we = Math.random();
        so_sprite_container_list.push(so_sprite_container);
        so_offset_container.addChild(so_sprite_container);
        // head
        circle = new createjs.Shape();
        var stroke = 5 - (980 / newWidth);
        circle.graphics.setStrokeStyle(stroke).beginStroke('#ffecec').beginFill('#fff').drawCircle(0, 0, newWidth / 15);
        so_sprite_container.addChild(circle);
      }
       container.addChild(so_container);

      */



      // body
      circle = new createjs.Shape();
      circle.graphics.beginFill('#fff').drawCircle(0, 0, newWidth / 4);
      circle.x = newWidth  / 2;
      circle.y = newHeight / 1.8;
      container.addChild(circle);
      // shadow map
      smap = new createjs.Shape();
      smap.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 5);
      smap.x = newWidth  / 2;
      smap.y = newHeight / 1.1;
      smap.scaleY = 0.1;
      smap.alpha  = 0.05;
      stage.addChild(smap);
      // eyes
      eye1 = new createjs.Shape();
      eye1.graphics.beginFill('#000').drawCircle(0, 0, newWidth / 25);
      eye1.x = newWidth   / 2.3;
      eye1.y = (newHeight / 1.65);
      eye1.compositeOperation = 'destination-out';
      container.addChild(eye1);
      eye2 = eye1.clone();
      eye1.x = (newWidth  / 2.3)  + ((getScrollPos()) * 15) / (980 / newWidth);
      eye2.x = (newWidth  / 1.75) - ((getScrollPos()) * 15) / (980 / newWidth);
      eye2.scaleX = eye2.scaleY = (eye1.scaleX - (getScrollPos() / 5) );

      container.addChild(eye2);
      // eyelid
      eyelid = new createjs.Shape();
      eyelid.graphics.setStrokeStyle(25).beginStroke('#fff').bezierCurveTo(0, 220, 100, 120, 200, 220);
      eyelid.x = newWidth   / 3.4;
      eyelid.y = (newHeight / 2.2) * (getScrollPos() * 0.4);
      eyelid.scaleX = eyelid.scaleY = (newWidth / 980) * 2;
      container.addChild(eyelid);

      cone = new createjs.Shape();
      cone.graphics.setStrokeStyle(100).beginStroke('#fff').bezierCurveTo(0, 200, 40, 100, 80, 200);
      cone.x = newWidth   / 2.4;
      cone.y = (newHeight / 0.4) * (getScrollPos() * 0.05);
      cone.scaleX = cone.scaleY = (newWidth / 980) * 2;
      //inside.compositeOperation = 'destination-out';
      container.addChild(cone);

      inside = new createjs.Shape();
      inside.graphics.setStrokeStyle(100).beginStroke('#ff0000').bezierCurveTo(0, 50, 150, 0, 300, 50);
      inside.x = newWidth   / 5;
      inside.y = (newHeight / 0.4) * (getScrollPos() * 0.08);
      inside.scaleX = inside.scaleY = (newWidth / 980) * 2;
      inside.compositeOperation = 'destination-out';
      container.addChild(inside);



      /* opzet met vraagtekens en uitroeptekens

          // create container and add x amount of sprites with either ? or ! depending on sroll pos
          lettercontainer = new createjs.Container();
          lettercontainer. y = newHeight / 10;
          for(llc = 0; llc < 10; llc ++){
            cc = parseInt((100 - (getScrollPos() * 100)) + 1); // top of page = 1:100 probability, bottom of page = 1:1 probability of '!' instead of '?'
            cc = 1 + (cc / 10); // lets cheat a bit with the probability
            if(parseInt(Math.random() * cc) == 0){
              letter = "?";
            } else {
              letter = '!';
            }
            cp = 40 + (Math.random() * (newHeight / 10));
            lt = new createjs.Text(letter, cp + "px Arial", "#fff");
            lt.x = newWidth / 2 + ((newWidth / 4) - (Math.random() * (newWidth / 2)));
            lt.y = (newHeight / 2) - ((newHeight / 3) + (Math.random() * (newHeight / 5)));
            tro = Math.random() * 10;
            if(lt.x < newWidth / 2){lt.rotation = 0 - tro} else {lt.rotation = tro}
            lt.alpha = 0 - (Math.random() * 10);
            ll.push(lt);
            lettercontainer.addChild(lt);
          }
          stage.addChild(lettercontainer); // add the lettercontainer to stage

      */

      break;

    default:

      cs = 1; // invalid scene requested, defaulting back to 1
      buildScene();
      break;

  }

  stage.addChild(container);
  stage.update();

}

function getScrollPos(){
  return ($(window).scrollTop() + $(window).height()) / ch; // gets current scrollposition relative to container height. returns float of 0 - 1
}

function handleTick() {
  offset       = Math.sin(os);
  container.y += offset; // bouncing effect
  if(cs == 3){
    hole.y -= offset;    // bouncing effect inverted for sink hole
  }
  smap.scaleX  = 1 - (Math.sin(os + 1.7) / 10); // shadow needs its own offset calculation since its inverted
  os += 0.05 + ((1 - getScrollPos()) / 10);

  // eye blinking
  if(eye1.alpha > 0){
    // eyes are open
    if(!la && parseInt(Math.random() * 200) == 1){
      eye1.alpha = eye2.alpha = 0; // close eyes
      ec = 0; // reset count
    }
  } else {
    // eyes are closed
    ec ++;
    if(ec > 10){
      eye1.alpha = eye2.alpha = 1; // open eyes
    }
  }

  // scene 2 specific stuff
  if(cs == 2){

   // main rotation
   so_container.rotation += 0.5;

    // rotation offset
    for(st = 0; st < so_sprite_container_list.length; st ++) {
    // so_sprite_container_list[st].rotation -= 0.5;
      if(so_sprite_container_list[st].alpha < 1){so_sprite_container_list[st].alpha += 0.1}
    }

    if(!la && eye1.alpha > 0 && parseInt(Math.random() * 100) == 1){
      if(getScrollPos() <= 1){
        // look to either side if eyes are not blinking (optional: and if scroll pos is below certain treshold)
        t = 100 * (newWidth / 1000);
        if(parseInt(Math.random() * 2) == 1){
          eye1.x -= t;
          eye2.x -= t;
        } else {
          eye1.x += t;
          eye2.x += t;
        }
        la = true;
        lc = 0;
      }
    } else if(la){
      lc ++;
      if(lc > 200){
        // reset eye position after n ticks
        eye1.x = newWidth / 2.3;
        eye2.x = newWidth / 1.75;
        la = false;
      }
    }
  }

  // scene 3 specific stuff
  if(cs == 3){
    star.rotation += 1;
  }

  // scene 4 specific stuff
  if(cs == 4){


    /* opzet met hersens

    for(st = 0; st < so_sprite_container_list.length; st ++) {
      var we = so_sprite_container_list[st].we;
      so_sprite_container_list[st].scaleX = so_sprite_container_list[st].scaleY = (1 + ((1 + we) * Math.sin(os + we) / 40));
    }

    */

    /* opzet met vraagtekens en uitroeptekens

    for(llc = 0; llc < ll.length; llc ++){
      if(ll[llc].scaleX != 0.999) {
        ll[llc].alpha += 0.05;
      }
      ll[llc].y -= 0.05;
      if(ll[llc].alpha >= 2) {
        ll[llc].scaleY = ll[llc].scaleX = 0.999; // turn scaling down a notch
      }
      if(ll[llc].scaleX == 0.999){
        // scaling has been adapted, time to do the zooming out part
        ll[llc].alpha -= 0.05;
        if(ll[llc].alpha < 0) {
          ll[llc].x = newWidth / 2 + ((newWidth / 4) - (Math.random() * (newWidth / 2)));
          ll[llc].y = (newHeight / 2) - ((newHeight / 3) + (Math.random() * (newHeight / 5)));
          ll[llc].alpha = 0 - (Math.random() * 10);
          tro = Math.random() * 10;
          if (ll[llc].x < newWidth / 2) {
            ll[llc].rotation = 0 - tro
          } else {
            ll[llc].rotation = tro
          }
        }
      }
    }

    */

  }

  // ease out
  if(tr || tl){
    if(tr){
      // user clicked right, so animate the shapes to the left
      container.x -= (1 - container.x) / 2;
      smap.x       = container.x + newWidth / 2;
      if(container.x < (0 - (newWidth * 2))){
        tr = false;
        cs ++;
        buildScene();
        container.x = 0 + (2 * newWidth); // place it outside viewing area
        $("html, body").animate({ scrollTop: 0 }, "50");
        $('header.type').text(ta[cs - 1]);
      }
    }
    if(tl){
      // user clicked left, so animate the shapes to the right
      container.x += (container.x + 1) / 2;
      smap.x       = container.x + newWidth / 2;
      if(container.x > (0 + (newWidth * 2))){
        tl = false;
        cs --;
        if(cs < 1){cs = ta.length}
        buildScene();
        container.x = 0 - (2 * newWidth); // place it outside viewing area
        $("html, body").animate({ scrollTop: 0 }, "50");
        $('header.type').text(ta[cs - 1]);
      }
    }
  }

  // ease in
  if(!tr && !tl){
    if(container.x > 0){
      container.x -= container.x / 2;
      smap.x       = container.x + newWidth / 2;
      if(container.x - 1 <= 0){container.x = 0;} // rounding
    }
    if(container.x < 0){
      container.x += 0 - (container.x / 2);
      smap.x       = container.x + newWidth / 2;
      if(container.x + 1 >= 0){container.x = 0;} // rounding
    }
  }

  stage.update();

}
