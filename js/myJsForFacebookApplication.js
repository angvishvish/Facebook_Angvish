/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){ //when the document is ready ..
    $('#clickToDisconnect').hide();// hide the logout button when the document is ready ..
    $('#loading').hide();// hide the loading image when the document is ready ..
    $('#toBackAndDownloadButton').hide(); // hiding the back and download button ..
    
    $("#loginMsg").click(function(){
        $("#loginMsg").delay(4000).slideUp('fast');
    });
    // click here to connect popover
    $("#clickToConnect").popover({
        title: '<b>Login</b>', 
        content: '<img src="img/popoverlogin.jpg" />', 
        placement: 'bottom',
        html:true
    });
    // click to goto github
    $("#mainLabel").popover({
        title: '<b>Checkout the Developer</b>', 
        content: '<img src="img/github.jpg" />', 
        placement: 'bottom',
        html:true
    });
    // click to disconnect popover
    $("#clickToDisconnect").popover({
        title: '<b>Logout</b>', 
        content: '<img src="img/popoverlogout.jpg" />', 
        placement: 'bottom',
        html:true
    });
    // click to disconnect popover
    $("#backAndDownloadButton").popover({
        title: '<b>Back to Album</b>', 
        content: '<img src="img/album.jpg" />', 
        placement: 'right',
        html:true
    });
    
    var facebookAuthorizationResponse;
    window.fbAsyncInit = function() {
        FB.init({
            appId: appId,
            // App ID
            status: true,
            // check login status
            cookie: true,
            // enable cookies to allow the server to access the session
            xfbml: true // parse XFBML
        });

    // Additional initialization code here
    };

    // Load the SDK Asynchronously
    (function(d) {
        var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));
    var accessToken='';
    // jquery to Authanticate User with app by asking for emailid and password 
    $("#facebookLoginButton").click(function() {
        FB.login(function(response) {
            if (response.authResponse) {
                facebookAuthorizationResponse=response;
                accessToken=response.authResponse.accessToken;
                //Set Accesstoken of user in session
                $.ajax({
                    url: 'someFacebookFunction.php',
                    type: 'post',
                    data: {
                        'accesstoken' : response.authResponse.accessToken
                    },
                    success: function(data) {
                    }
                });
                $('#loading').show();//showing loading gif while facebook is sending photos
                // showing the login msg
                $('#loginMsg').html('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>\n\
                        <strong>Sucessfull !!</strong>\n\
                         Congratulation you have successfully Logged IN into the system.</div>').delay(1000).slideDown('slow');
                $('#loginMsg').delay(5000).slideUp('slow');
                //Get User Name
                var displayNameAndImage='';
                FB.api('/me?fields=picture,name',function(respo){
                    displayNameAndImage+='<h3 id="displayUserName"><button class="btn btn-large btn-success btn-block" type="button"><a href="https://www.facebook.com/">';
                    displayNameAndImage+='<span class="label label-inverse"><img class="img-circle img-polaroid" src="'+respo.picture.data.url+'"></img></span>';
                    displayNameAndImage+='<strong> '+respo.name+"</strong></a></button></h3>";
                    $("#displayName").html(displayNameAndImage).show();// display the current user name ..
                    $("#userName").popover({
                        title: '<strong>'+respo.name+'</strong>', 
                        content: '<img src="'+respo.picture.data.url+'">', 
                        placement: 'bottom',
                        html:true
                    });
                });
                $("#clickToConnect").hide();// hidding the facebook button ..
                //show all ablums of user ..
                FB.api('/me/albums', showAlbums);
                
            } else {
                alert("Please Enter Email/Password to login !!");
            }
        }, {
            scope: 'email,user_photos'
        });
    });
    var photosInsideAlbums='';
    function showAlbums(response) {
        $('#loading').show();//showing loading gif while facebook is sending photos
        $('#containgAlbumCover').show();
        
        $('#userAlbums').empty();
        $.each(response.data, function(key, value) {
            //create html structure
            var albumHtmlAppend='';
            photosInsideAlbums='';
            //$('#userAlbums').html(albumHtmlAppend);
            //document.getElementById("userAlbums").value="";
            $('#photoInsideAlbum').html(photosInsideAlbums);
            albumHtmlAppend += '<div id="albumCoverPhoto' + key + '" class="span3"> ';// album cover photos div
            albumHtmlAppend+='<a href="#" class="albumCoverPhotolink' + key + '">';// allowing to click on album cover photos links
            albumHtmlAppend+='<img class="imgcover" id="coverphoto' + key + '" src="img/loading.gif"></img>';//cover photos of the album 
            albumHtmlAppend+='</a>';
            albumHtmlAppend+='<a href="'+value.link+'" class="albumName' + key + '">';
            albumHtmlAppend+='<h6>' + value.name + '</h6>';// name of the album ..
            albumHtmlAppend+='</a>';
            albumHtmlAppend+='<p id="pageLink">';
            albumHtmlAppend+='<i id="downloadThisAlbum'+key+'" class="downloadThisAlbum">';
            albumHtmlAppend+='<img class="img-circle img-polaroid" src="img/download.jpg"></img>';
            albumHtmlAppend+='</i>';
            albumHtmlAppend+='<span class="label label-success"> Total of ';
            if(value.count==1)
                albumHtmlAppend+='<span class="badge badge-info">' + value.count + '</span> Image</span></p>';// number of images in the album ..    
            else{
                if(value.name=='Mobile Uploads'){
                    var count=0;
                    count=value.count-1;
                    albumHtmlAppend+='<span class="badge badge-info">' + count + '</span> Image</span></p>';// number of images in the album ..
                }
                else
                    albumHtmlAppend+='<span class="badge badge-info">' + value.count + '</span> Images</span></p>';// number of images in the album ..
            }
            albumHtmlAppend+='</div>';
            $('#userAlbums').append(albumHtmlAppend);
            $('#loading').hide();
            $('#clickToDisconnect').show();//show the logout button ..
            
            // popover jquery for downloading image
            $('#downloadThisAlbum'+key).popover({
                title: '<b>Download '+value.name+'</b>',
                content: '<img src="img/zip.jpg">',
                placement: 'bottom',
                html:true
            });
            //calling the facebook api for cover photos..
            FB.api('/' + value.cover_photo + '', function(response) {
                // if user doesn't  has pictures ..
                if (!response.picture) {
                    if(value.count){
                        $('#coverphoto' + key).attr("src",'img/No-Cover.jpg');
                        //goto page link
                        $('#coverphoto' +key).popover({
                            title: '<b>Please Click to view Album  !!</b>',
                            content: '<img src="img/No-Cover.jpg">',
                            placement: 'bottom',
                            html:true
                        });
                    }else
                        $('#albumCoverPhoto' + key).hide();
                } 
                // if he have any cover album..
                else {
                    $('#loading_' + key).hide();
                    $('#coverphoto' + key).attr("src", response.picture);
                    //goto page link
                    $('#coverphoto' +key).popover({
                        title: '<b>Please Click to view Album  !!</b>',
                        content: '<img src="'+response.picture+'">',
                        placement: 'bottom',
                        html:true
                    });
                }
            });
            
            // when clicked show the photos inside the albums ..
            $('.albumCoverPhotolink' + key).click(function(event) {
                event.preventDefault();
                show_albums_photos(value.id);
            });
            // download this album when user clicks it ..
            $('#downloadThisAlbum' + key).click(function(event) {
                event.preventDefault();
                downloadAlbum(value.id,value.name);
            });
        });
    }
    //get all photos for an album and hide the album view
    function show_albums_photos(album_id) {
        $('#loading').show(); //showing the loading image ..
       
        FB.api('/' + album_id + '/photos', function(response) {
            
            photosInsideAlbums='';
            $('#photoInsideAlbum').html(photosInsideAlbums);
            photosInsideAlbums+='<div class="camera_wrap camera_azure_skin pattern_1" id="camera_wrap_4">';
            $.each(response.data, function(key, value) {
                photosInsideAlbums+='<div class="imageSize" data-portrait="'+value.picture+'" data-src="'+value.source+'" data-thumb="'+value.picture+'" >';
                //alert('href="../someFacebookFunction.php?downloadImage='+value.source+'"');
                if(value.name==null){
                    photosInsideAlbums+='<div class="camera_caption moveFromLeft">No tags found .. &nbsp&nbsp&nbsp&nbsp&nbsp';
                    photosInsideAlbums+='<a id="pageLink" href="'+value.link+'">Go To page</a>';
                    photosInsideAlbums+='</div>';// camera fade from bottom ends ..
                //$('#downloadImage').attr("href",value.source);
                }
                else
                {
                    photosInsideAlbums+='<div class="camera_caption moveFromLeft">'+value.name+'&nbsp&nbsp&nbsp&nbsp&nbsp';
                    photosInsideAlbums+='<a id="pageLink" href="'+value.link+'">Go To page</a>';
                    photosInsideAlbums+='</div>';// camera fade from bottom ends ..
                //$('#downloadImage').attr("href",value.source);
                }
                photosInsideAlbums+='</div>';
            });
            photosInsideAlbums+='</div>';
            $("body").fadeIn('slow').css("background-image","none").css('background-color', '#00334C');//showing a background image
            $('#photoInsideAlbum').append(photosInsideAlbums);
            jQuery(function(){
                jQuery('#camera_wrap_4').camera({
                    height: 'auto',
                    pagination: false,
                    thumbnails: false,
                    hover: false,
                    opacityOnGrid: false,
                    imagePath: 'https://fbcdn-photos-g-a.akamaihd.net/'
                });
            });
            
            $('#mainLabel').hide();
            $('#clickToDisconnect').hide();// hiding the logout button
            $('#containgAlbumCover').hide();// hiding the list of albums
            $('.fluid_container').show();
            $('#toBackAndDownloadButton').show();
            $('#loading').hide(); //hideing the loading image ..
        });
    }
    $('#facebookLogoutButton').click(function(){
        $('#loginMsg').hide('slow');
        $('#logoutMsg').show('slow');
        
        FB.logout(function(response) {
            $('#containgAlbumCover').slideUp("fast");
            $('#displayName').hide();
            $('#clickToConnect').show();
            $('#clickToDisconnect').hide();
        });
        // showing the logout msg
        $('#logoutMsg').html('<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button>\n\
                        <strong>Sucessfull !!</strong>\n\
                         Congratulation you have successfully Logged OUT the system.</div>').delay(1000).slideDown('slow');
        $('#logoutMsg').delay(2000).slideUp('slow');
    });
    //this is the jquery for going back to the main list of album page ..
    $('#backAndDownloadButton').click(function(){
        $("body").css("background-image","url('img/texture.jpg')");//showing a background image
        $('#toBackAndDownloadButton').hide();
        $('#mainLabel').show();
        $('#loading').show(); //showing the loading image ..
        $('.fluid_container').hide();// hiding the list of images in a particular album
        $('#containgAlbumCover').show(); //showing the list of albums
        $('#clickToDisconnect').show();// hiding the list of albums
        $('#loading').hide(); //showing the loading image ..
    });
    //photosCounter.serializeArray();
    function downloadAlbum(album_id,name){
        var id=album_id;
        var album_name=name;
        //window.location = "album.php?id="+ album_id+"&access="+accessToken+"&name="+name;
        //self.location='download_new.php';
        //alert(id+" "+name);
        var count=0;
        setInterval(function() {
            if(count!=100){
                var loadingForDownload='<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>';
                loadingForDownload+='<p><h3>Thanks for Clicking !!<h3></p>';
                loadingForDownload+='<p><h3>--<strong>'+album_name+'--</strong></h3>will be downloaded in a while, Please wait..</p>';
                loadingForDownload+='<div id="showDownload"><div class="progress progress-striped active">';
                loadingForDownload+='<div class="bar" style="width: '+count+'%;"></div></div>';
                loadingForDownload+='<div class="">';
                loadingForDownload+='<strong> ( Building the zip - '+count+' % Compeleted ) </strong>';
                loadingForDownload+='<button id="clickToDownload" name="filter" class="disabled btn btn-large btn-info" data-loading-text="Downloading..">';
                loadingForDownload+='Click to Download</button>';
                loadingForDownload+='</div></div>';
                $('#loadingForDownload').html(loadingForDownload).show(); //showing the loading image ..
                count++;
            }
        }, 100);
        // cancel all the images
        
        $.ajax({ //Ajax call to download script to get the photos and zip them
            type: "POST",
            data: {
                id: album_id,
                name: album_name,
                access: accessToken
            },
            url: "zipAlbum.php",
            success: function(){
                count=100;
                var showDownload='<div class="progress progress-success progress-striped">';
                showDownload+='<div class="bar" style="width: 100%;"></div>';
                showDownload+='</div><div class="">';
                showDownload+='<strong> ( Building the zip- '+count+' % Compeleted ) </strong>';
                showDownload+='<button id="clickToDownload" name="filter" class="btn btn-large btn-success" data-loading-text="Downloading..">';
                showDownload+='Click to Download</button>';
                showDownload+='</div>'
                $('#showDownload').html(showDownload);
                $('#clickToDownload').click(function(){
                    //On Completion of Zipping all the files, Request for headers to prompt user for download
                    $.ajax({
                        url: "downloadZip.php",
                        success: function(data){
                            $('#loadingForDownload').delay(1000).slideUp("slow").html(''); //hiding the loading image ..
                        }
                    });
                });                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                return false;
            }
        });
    }// download albums ends
});// document ready ends ..