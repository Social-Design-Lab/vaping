//$(document).ready(function() {

//Before Page load:
$('#content').hide();
$('#loading').show();


document.addEventListener("DOMContentLoaded", function(event) { 
  var name  = document.getElementById('demo');
  console.log("bbbb succeed");
  console.log("test from main.js")
});

function isInViewport(el) {
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
}
//console.log("what is going on with "  + el);
var rect = el.getBoundingClientRect();
/* console.log(el.innerHTML);
console.log(rect.bottom );
console.log(window.innerHeight);
console.log(rect.right);
console.log(window.innerWidth); */
return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    (rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
);
  
}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

function sendread()
{
  //console.log("function is been called");
  for (let i =0 ; i<postidarray.length ;i++)
  {
    
    
    var test = document.querySelector(".ui.fluid.card[postid=" + "'"+postidarray[i]+"'"+"]").getElementsByTagName('img')[1].src;
    //var imgsrc = test.replace(/^(?:\/\/|[^/]+)*\//, '');
    var y = document.querySelector(".ui.fluid.card[postid=" + "'"+postidarray[i]+"'"+"]").getElementsByClassName('description')[0];
    //var y = document.querySelector("img[src='/"+imgsrc+"']");
    //console.log
    //console.log("is "+y.innerHTML+ " in the window?  " + isInViewport(y));
    if(y!=null &&isInViewport(y))
    {
      
      //console.log("imgae src: " + imgsrc);
      //console.log("postid has been viwed:zzzzzzzzz " + postidarray[i]);
      //console.log("check if remove function works: " + postidarray.length) ;
      usedarray.push(postidarray[i]);
      $.post( "/feed", { postID: postidarray[i], start: totaltimearray[i] } );
      //$.post( "/feed", { postID: postidarray[i], start: totaltimearray[i], _csrf : $('meta[name="csrf-token"]').attr('content')  } );
      console.log("send one to database postid: " +postidarray[i]);
      postidarray.remove(postidarray[i]);
      //console.log("number of posts has been viewd: " + usedarray.length);
      //console.log("number of posts has not been viewd: " + postidarray.length);
      //console.log("length should decrease by one: " + postidarray.length) ;
      totaltimearray.remove(totaltimearray[i]);
      
      break;
    }
  }
}


$(window).on("load", function() {

  //close loading dimmer on load
  $('#loading').hide();
  $('#content').attr('style', 'block');
  $('#content').fadeIn('slow');
  //close messages from flash message
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });

  //check bell
  if (!(top.location.pathname === '/login' || top.location.pathname === '/signup'))
  {

    $.getJSON( "/bell", function( json ) {

      if (json.result)
      {
        $("i.big.alarm.icon").replaceWith( '<i class="big icons"><i class="red alarm icon"></i><i class="corner yellow lightning icon"></i></i>' );
      }

   });
}

  //make checkbox work
  $('.ui.checkbox')
  .checkbox();


  $(' .ui.tiny.post.modal').modal({
      observeChanges  : true
    })
  ;

  //get add new feed post modal to work
  $("#newpost, a.item.newpost").click(function () {
    $(' .ui.tiny.post.modal').modal('show');
});

  //new post validator (picture and text can not be empty)
  $('.ui.feed.form')
  .form({
    on: 'blur',
    fields: {
      body: {
        identifier  : 'body',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please add some text about your meal'
          }
        ]
      },
      picinput: {
        identifier  : 'picinput',
        rules: [
          {
            type: 'notExactly[/public/photo-camera.svg]',
            prompt : 'Please click on Camera Icon to add a photo'
          }
        ]
      }
    },

    onSuccess:function(event, fields){
      //console.log("Event is :");
      //console.log(event);
      //console.log("fields is :");
      //console.log(fields);
      $(".ui.feed.form")[0].submit();
    }

  });

  $('.ui.feed.form').submit(function(e) {
        e.preventDefault();
        //console.log("Submit the junks!!!!")
        //$('.ui.tiny.nudge.modal').modal('show');
        //return true;
        });


//Picture Preview on Image Selection
function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            //console.log("Now changing a photo");
            reader.onload = function (e) {
                $('#imgInp').attr('src', e.target.result);
                //console.log("FILE is "+ e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#picinput").change(function(){
        //console.log("@@@@@ changing a photo");
        readURL(this);
    });

//Modal to show "other users" in Notifications
/*
$('a.others').click(function(){
  let key = $(this).attr('key');
  $('.ui.long.extrausers.modal#'+key).modal({
    onVisible: function() {
      var el = document.querySelector('.ui.long.extrausers.modal#'+key+" div.ui.extra.divided.items");
      var lazyLoad = new LazyLoad({
         container: el /// <--- not sure if this works here, read below
    });
    }
  }).modal('show')
}); */

//add humanized time to all posts
$('.right.floated.time.meta, .date').each(function() {
    var ms = parseInt($(this).text(), 10);
    let time = new Date(ms);
    $(this).text(humanized_time_span(time));
});

  //Sign Up Button
  $('.ui.big.green.labeled.icon.button.signup')
  .on('click', function() {
    window.location.href='/signup';
  });

  //Sign Up Info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/com';
  });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.com')
  .on('click', function() {
    window.location.href='/info'; //maybe go to tour site???
  });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.info')
  .on('click', function() {
    window.location.href='/'; //maybe go to tour site???
  });

  //Profile explaination Page
  $('.ui.big.green.labeled.icon.button.profile')
  .on('click', function() {
    window.location.href='/profile_info'; //maybe go to tour site???
  });

  //More info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/com'; //maybe go to tour site???
  });

  //Edit button
  $('.ui.editprofile.button')
  .on('click', function() {
    window.location.href='/account';
  });






////////////////////
$("input.newcomment").keyup(function(event) {
    //i.big.send.link.icon
    //$(this).siblings( "i.big.send.link.icon")
    if (event.keyCode === 13) {
        $(this).siblings( "i.big.send.link.icon").click();
    }
});

//create a new Comment
$("i.big.send.link.icon").click(function() {
  var text = $(this).siblings( "input.newcomment").val();
  var card = $(this).parents( ".ui.fluid.card" );
  var comments = card.find( ".ui.comments" )
  //no comments area - add it
  //console.log("Comments is now "+comments.length)
  if( !comments.length )
  {
    //.three.ui.bottom.attached.icon.buttons
    //console.log("Adding new Comments sections")
    // var buttons = card.find( ".three.ui.bottom.attached.icon.buttons" )
    // buttons.after( '<div class="content"><div class="ui comments"></div>' );
    // var comments = card.find( ".ui.comments" )
    var buttons = card.find('#falgebutton.ui.basic.button').parents('div.content')
    buttons.after('<div class="content"><div class="ui comments"></div>')
    var comments = card.find( ".ui.comments" )
  }
  if (text.trim() !== '')
  {
    //console.log(text)
    var date = Date.now();
    var ava = $(this).siblings('.ui.label').find('img.ui.avatar.image');
    var ava_img = ava.attr( "src" );
    var ava_name = ava.attr( "name" );
    var postID = card.attr( "postID" );

    var mess = '<div class="comment"> <a class="avatar"> <img src="'+ava_img+'"> </a> <div class="content"> <a class="author">'+ava_name+'</a> <div class="metadata"> <span class="date">'+humanized_time_span(date)+'</span> <i class="heart icon"></i> 0 Likes </div> <div class="text">'+text+'</div> <div class="actions"> <a class="like">Like</a> <a class="flag">Flag</a> </div> </div> </div>';
    $(this).siblings( "input.newcomment").val('');
    comments.append(mess);
    //console.log("######### NEW COMMENTS:  PostID: "+postID+", new_comment time is "+date+" and text is "+text);

    if (card.attr( "type" )=='userPost')
      $.post( "/userPost_feed", { postID: postID, new_comment: date, comment_text: text, _csrf : $('meta[name="csrf-token"]').attr('content') } );
    else
      $.post( "/feed", { postID: postID, new_comment: date, comment_text: text, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  }
});
  

  //this is the REPORT User button
  $('button.ui.button.report')
  .on('click', function() {

    var username = $(this).attr( "username" );

    $('.ui.small.report.modal').modal('show');

    $('.coupled.modal')
      .modal({
        allowMultiple: false
      })
    ;
    // attach events to buttons
    $('.second.modal')
      .modal('attach events', '.report.modal .button')
    ;
    // show first now
    $('.ui.small.report.modal')
      .modal('show')
    ;

  });

  //Report User Form//
  $('form#reportform').submit(function(e){

    e.preventDefault();
    $.post($(this).attr('action'), $(this).serialize(), function(res){
        // Do something with the response `res`
        //console.log(res);
        // Don't forget to hide the loading indicator!
    });
    //return false; // prevent default action

});

  $('.ui.home.inverted.button')
    .on('click', function() {
      window.location.href='/';
    });

  //this is the Block User button
  $('button.ui.button.block')
  .on('click', function() {

    var username = $(this).attr( "username" );
    //Modal for Blocked Users
    $('.ui.small.basic.blocked.modal')
      .modal({
        closable  : false,
        onDeny    : function(){
          //report user

        },
        onApprove : function() {
          //unblock user
          $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
      })
      .modal('show')
    ;


    //console.log("***********Block USER "+username);
    $.post( "/user", { blocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });

  //Block Modal for User that is already Blocked
  $('.ui.on.small.basic.blocked.modal')
  .modal({
    closable  : false,
    onDeny    : function(){
      //report user

    },
    onApprove : function() {
      //unblock user
      var username = $('button.ui.button.block').attr( "username" );
      $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }
  })
  .modal('show')
;

  //this is the LIKE button
  //#likeButton.ui.basic.button
  $('#likeButton.ui.basic.button')
  .on('click', function() {
    //console.log("The button works");
    //alert("The button works");
    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        //console.log("***********UNLIKE: post");
        $( this ).removeClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) { return val*1-1 });
        var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
        var like = Date.now();
        //console.log("***********UNLIKE: post "+postID+" at time "+unlike);
        if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
        {
          console.log("red user post");
          $.post( "/userPost_feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
        else
        {
          console.log("red non user post");
          $.post( "/feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
    }
    //since not red, this button press is a LIKE action
    else{
      $(this).addClass("red");
      var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
      label.html(function(i, val) { return val*1+1 });
      var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
      var like = Date.now();
      console.log("***********LIKE: post "+postID+" at time "+like);

      if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
       {
         $.post( "/userPost_feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
         console.log("non red userPost ? ");
       }
      else
      {
        console.log("like time: " + like);
        $.post( "/feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        console.log("non red non userpost ");
      }

    }

  });

  //a.like.comment
  $('a.like.comment')
  .on('click', function() {

    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        //console.log("***********UNLIKE: post");
        //Un read Like Button
        $( this ).removeClass("red");

        var comment = $(this).parents( ".comment" );
        comment.find( "i.heart.icon" ).removeClass("red");

        var label = comment.find( "span.num" );
        label.html(function(i, val) { return val*1-1 });

        var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
        var commentID = comment.attr("commentID");
        var like = Date.now();

        if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost'){
          //$.post( "/userPost_feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        } else {
          $.post( "/feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
    }
    //since not red, this button press is a LIKE action
    else{
      $(this).addClass("red");
      var comment = $(this).parents( ".comment" );
      comment.find( "i.heart.icon" ).addClass("red");

      var label = comment.find( "span.num" );
      label.html(function(i, val) { return val*1+1 });

      var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
      var commentID = comment.attr("commentID");
      var like = Date.now();
      //console.log("#########COMMENT LIKE:  PostID: "+postID+", Comment ID: "+commentID+" at time "+like);

      if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
        $.post( "/userPost_feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      else
        console.log("comment has been liked: "+ commentID);
        $.post( "/feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }

  });

   //this is the FLAG button
   //flag a comment
  $('a.flag.comment')
  .on('click', function() {

    var comment = $(this).parents( ".comment" );
    var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
    var typeID = $(this).closest( ".ui.fluid.card" ).attr( "type" );
    var commentID = comment.attr("commentID");
    comment.replaceWith( '<div class="comment" commentID='+commentID+' style="background-color:black;color:white"><h5 class="ui inverted header"><span>The admins will review this post further. We are sorry you had this experience.</span></h5></div>' );
    var flag = Date.now();
    //console.log("#########COMMENT FLAG:  PostID: "+postID+", Comment ID: "+commentID+"  TYPE is "+typeID+" at time "+flag);

    if (typeID=='userPost')
      $.post( "/userPost_feed", { postID: postID, commentID: commentID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );
    else
      console.log("comments has been flagged: " +commentID);
      $.post( "/feed", { postID: postID, commentID: commentID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });

  //this is the "yes" button when responding to the content moderation question
 $('.agree')
 .on('click', function() {

   var comment = $(this).parents( ".ui.info.message").children('.comment');
   var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
   var typeID = $(this).closest( ".ui.fluid.card" ).attr( "type" );
   var commentID = comment.attr("commentID");
   var nextQuestion = $(this).parents('.ui.info.message').siblings('.comment.modRespondedYes');
   var currentQuestion =  $(this).parents('.ui.info.message');
   var clickedYes = Date.now();
   $(this).closest( ".ui.fluid.card" ).css({'background-color':''});
   $(this).closest('.info.message').css({'box-shadow':''});
   $(this).parent('.content').siblings('.ui.inverted.dimmer').removeClass('disabled').addClass('active');

   $.post( "/feed", { postID: postID, commentID: commentID, clickedYes: clickedYes, _csrf : $('meta[name="csrf-token"]').attr('content') }, function(){
     currentQuestion.hide();
     nextQuestion.show();
   } );
 });

 $('#falgebutton.ui.basic.button')
  .on('click', function() {
     active_flag = 1;
    temp = parseInt(localStorage.getItem("session_flags"))+1;
    window.localStorage.setItem("session_flags",temp);
    console.log('session flag number: ', localStorage.getItem("session_flags"));
     var post = $(this).closest( ".ui.fluid.card.dim"); // ok I guess instead of doing on the whole card, do it on
     var postID = post.attr( "postID" );
     var flag = Date.now();
     console.log("***********FLAG: post "+postID+" at time "+flag);
     $.post( "/feed", { postID: postID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );
     console.log("Removing Post content now!");
     post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
      //repeat to ensure its closable             
      post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');

    var img_flagged = $(this).closest( ".imgage.dim");
    img_flagged.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
    //repeat to ensure its closable             
    img_flagged.find(".ui.dimmer.flag").dimmer({
                 closable: false
                })
                .dimmer('show');
    

  });

  //this is the POST FLAG button
  //flag a post
  $('.flag.button')
  .on('click', function() {

     var post = $(this).closest( ".ui.fluid.card.dim");
     var postID = post.attr( "postID" );
     var flag = Date.now();
     //console.log("***********FLAG: post "+postID+" at time "+flag);
     $.post( "/feed", { postID: postID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );
     //console.log("Removing Post content now!");
     post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
      //repeat to ensure its closable
      post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');


  });

  //this is the POST REPLY button
  $('.reply.button')
  .on('click', function () {

    let parent = $(this).closest(".ui.fluid.card");
    let postID = parent.attr("postID");

    parent.find("input.newcomment").focus();

  });
//////TESTING
$('.ui.fluid.card .img.post')
.visibility({
  once       : false,
  continuous : false,
  observeChanges: true,
  //throttle:100,
 

//handling scrolling down like normal
  onBottomVisible:function(calculations){
    var startTime = Date.now();
    $(this).siblings(".content").children(".myTimer").text(startTime);
    if(calculations.topVisible){ //then we are scrolling DOWN normally and this is the START time
      $(this).siblings(".content").children(".myTimer").text(startTime);
    } else { //then we are scrolling UP and this event does not matter!
    }
  },

  onTopPassed:function(calculations){
    var endTime = Date.now();
    var startTime = parseInt($(this).siblings(".content").children(".myTimer").text());
    var totalViewTime = endTime - startTime; //TOTAL TIME HERE
    //POST HERE
    var parent = $(this).parents(".ui.fluid.card");
    var postID = parent.attr( "postID" );
    console.log(postID + usedarray.includes(postID));
    if(usedarray.length==0 )
    {
      $.post( "/feed", { postID: postID, start: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content')  } );
      console.log("send one to database postid: " +postID);
      //postidarray[0]=postID;
      usedarray.push(postID);
      //console.log("added new stadd");
    }
    //console.log(usedarray.includes(postID));
    //console.log("used array length: " +usedarray.length);
    if(usedarray.includes(postID)==false)
      {
        //console.log("what element we added into postidarray : " + postID);
        postidarray.push(postID);
        totaltimearray.push(totalViewTime);
        //console.log("unused array length: " +postidarray.length)
        //console.log("added new stadd");
      }
    sendread();
    //var test = $(this).parents(".lazyloaded").attr("src");
    //console.log(postID);
    //Don't record it if it's longer than 24 hours, do this check because refresh causes all posts to be marked as "viewed" for 49 years.(???)
    /* if(totalViewTime < 86400000){
      $.post( "/feed", { postID: postID, start: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      console.log("***********Post has been viewd : post "+postID+" at time "+totalViewTime);
    } */
/*       //let ps = 'postid="'+postID+'"'; 
      if(postID==postidarray[0]&&firstused==false)
      {
       //console.log("postid has been viwed: " + postidarray[0]);
        firstused=true;
        $.post( "/feed", { postID: postidarray[0], start: totalViewTime[0] } );
        usedarray.push(postidarray[0]);
      }
      //console.log(ps);
      for (let i =1 ; i<postidarray.length ;i++)
      {
        var test = document.querySelector(".ui.fluid.card[postid=" + "'"+postidarray[i]+"'"+"]").getElementsByTagName('img')[1].src;
        var imgsrc = test.replace(/^(?:\/\/|[^/]+)*\//, '');
        var y = document.querySelector("img[src='/"+imgsrc+"']");
        
        console.log("imgae src: " + imgsrc);
        if(y!=null &&isInViewport(y))
        {
          //console.log("imgae src: " + imgsrc);
          //console.log("postid has been viwed:zzzzzzzzz " + postidarray[i]);
          //console.log("check if remove function works: " + postidarray.length) ;
          usedarray.push(postidarray[i]);
          $.post( "/feed", { postID: postidarray[i], start: totalViewTime[i] } );
          postidarray.remove(postidarray[i]);
          console.log("number of posts has been viewd: " + usedarray.length);
          console.log("number of posts has not been viewd: " + postidarray.length);
          //console.log("length should decrease by one: " + postidarray.length) ;
          totaltimearray.remove(totaltimearray[i]);
          break;
          
        }
        
      } */
      //let p = test[0].attributes.postid; 
      //var pstr = JSON.stringify(p);
      //console.log("print oout psts"+ JSON.stringify(test[0]));
      //console.log(pstr==ps);
      
    //for (let i = 0; i < test.length; i++) {
        //console.log("test  chen  " + test[i].attributes.postid.displayName);
        //console.log("end test ");
        
        //console.log(JSON.stringify((test[i].attributes['postid'])));
       // if(test[i].attributes.postid==postID)
       // {
          //var targetpost = document.getElementsByClassName(".ui.fluid.card").getElementsByClassName("lazyloaded")[i]
         //console.log(test[i]);
        //}
     // } 
      //var y = document.querySelector("img[src='/pic1.png']");
      //document.querySelectorAll('.lazyloaded'); 
      //console.log("beggining ");
      //console.log(typeof p);
      //console.log("***********Post has been viewd : post "+postID+" at time "+totalViewTime);
      
  
    //console.log("Total time: " + totalViewTime);
    //console.log($(this).siblings(".content").children(".description").text());
  },
//end handling downward scrolling

//handling scrolling back upwards
/*   onTopPassedReverse:function(calculations){
    var startTime = Date.now();
    $(this).siblings(".content").children(".myTimer").text(startTime);
  },

  onBottomVisibleReverse:function(calculations){
    if(calculations.bottomPassed){

    } else {
      //eND TIME FOR SCROLLING UP
      var endTime = Date.now();
      var startTime = parseInt($(this).siblings(".content").children(".myTimer").text());
      var totalViewTime = endTime - startTime; //TOTAL TIME HERE
      //POST HERE
      var parent = $(this).parents(".ui.fluid.card");
      var postID = parent.attr( "postID" );
      //console.log("PostID: " + postID);
      //console.log(postID);
      //Don't record it if it's longer than 24 hours, do this check because refresh causes all posts to be marked as "viewed" for 49 years. (???)
      if(totalViewTime < 86400000){
        $.post( "/feed", { postID: postID, start: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      }
      //console.log("Total time: " + totalViewTime);
      //console.log($(this).siblings(".content").children(".description").text());
    }
//end handling scrolling back updwards

  } */

});

});


var postidarray =[]; 
var totaltimearray=[];
var usedarray = [];
var firstused = false;
$(window).scroll(function() {
  sendread(postidarray, totaltimearray);
});
//sendread(postidarray, totaltimearray);