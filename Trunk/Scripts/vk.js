/*
function getAlbum(album_id) {
    
    VK.api('photos.get',{ owner_id: 1413115, album_id: album_id, rev: 0, v: 5.37}, function(data) {
        if (data.response) {
            // data.response is object
            var d = data.response.items;
            for (i = 0; i < d.length; i++)
            {
                var element = '<div id="div'+ i +'" class="element" >';
                element += '<div class="description">' + d[i].text + '</div>';
                element += '<div class="photo"><img src="' + d[i].photo_807 + '" /></div>';
                element += '</div>';
                $('#VKAlbum').append(element);
            }
        }
    }); 
}
 
$(function() { 
        VK.init({
            apiId: 5108181 // VK app ID
        });
    }
);
*/

function getAlbum(albumId) {
    getAlbumAJAX(albumId, $('#VKAlbum'), createAlbum);
}



function getAlbumAPI(albumId, rootElement, cb) {
    
    VK.api('photos.get',{ owner_id: 1413115, album_id: album_id, rev: 0, v: 5.37}, function(data) {
        if (data.response) {
            // data.response is object
            var d = data.response.items;
            cb(d, rootElement);
        }
    }); 
}

function getAlbumAJAX(albumId, rootElement, cb) {
    
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