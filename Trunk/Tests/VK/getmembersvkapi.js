function authInfo(response) {    
    if(response.status=='connected') {	// если пользователь залогинен в ВК     
        if(typeof(response.session.user) == 'undefined') { // этого поля нет 
            //тогда, когда пользователь был залогинен ранее
            VK.Api.call('users.get', { uid: response.session.mid }, function(r) { 
                $('#VKInfo').html(r.response[0].first_name+' '+r.response[0].last_name); 
                $('#VKInfo').append('user_id: '+response.session.mid); });
        } else {
            // если авторизация прошла только что (от VK.Auth.login(authInfo);), то имя и фамилия уже будут в ответе   
            $('#VKInfo').html(response.session.user.first_name+' '+response.session.user.last_name);
            $('#VKInfo').append('user_id: '+response.session.mid);
        }
    } else {
        VK.Auth.login(authInfo); // опционально можем спалиться и вызвать всплывающее окно авторизации
    }
}

function getAlbum(albumId, rootElement, cb) {
    
    VK.api('photos.get',{ owner_id: 1413115, album_id: album_id, rev: 0, v: 5.37}, function(data) {
        if (data.response) {
            // data.response is object
            var d = data.response.items;
            cb(d, rootElement);
        }
    }); 
}

function getAlbum2(albumId, rootElement, cb) {
    
    $.ajax( {
        url: "http://api.vkontakte.ru/method/getPhotos",
        data: {
            album_id: albumId,
            owner_id: 1413115,
            rev: 0,
            v: 5.37
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
            cb(rootElement, data.response.items);
    })
    .error(function (xhr, status, error) {
        console.log(err.Message);
    });
}

function createAlbum(rootElement, data) {
    var d = data;
    for (i = 0; i < d.length; i++)
    {
        var element = '<div id="div'+ i +'" class="element" >';
        element += '<div class="description">' + d[i].text + '</div>';
        element += '<div class="photo"><img src="' + d[i].photo_807 + '" /></div>';
        element += '</div>';
        rootElement.append(element);
        /*
        VK.api('photos.getComments', {owner_id: 1413115, pid: d[i].pid}, function(data) {
            if (data.response) {
                var a = data.response;
            } });
        */
    }
}
 
$(function() { 
    /*
    VK.init({
        apiId: 5108181 // ID вашего приложения VK
    });
*/

    //VK.Auth.getLoginStatus(authInfo); 
    //VK.Auth.login(authInfo);
    //getAlbum(221998000, $('body'));
    getAlbum2(221998000, $('body'), createAlbum);

});
