function getAlbum(albumId) {
    getAlbumDescription(albumId, $('#VKAlbum'), createAlbumDescriptionMarkup);
    getAlbumPhotos(albumId, $('#VKAlbum'), createAlbumMarkup);
}

function getAlbumPhotos(albumId, rootElement, cb) {
    
    $.ajax( {
        url: "http://api.vk.com/method/getPhotos",
        data: {
            album_id: albumId,
            owner_id: 1413115/*,
            rev: 0,
            v: 5.37*/
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        //cb(rootElement, data.response.items);
        cb(rootElement, data.response);
    })
    .error(function (xhr, status, error) {
        console.log(err.Message);
    });
}

function getAlbumDescription(albumId, rootElement, cb) {
    
    $.ajax( {
        url: "http://api.vk.com/method/photos.getAlbums",
        data: {
            album_ids: albumId,
            owner_id: 1413115/*,
            rev: 0,
            v: 5.37*/
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        //cb(rootElement, data.response.items);
        cb(rootElement, data.response);
    })
    .error(function (xhr, status, error) {
        console.log(err.Message);
    });
}

function createAlbumMarkup(rootElement, data) {
    var d = data;
    for (i = 0; i < d.length; i++)
    {
        var element = '<div id="div'+ i +'" class="element" >';
         
        var desc = d[i].text;
        /*
        var delimiter = "<br><br>";
        if (i==0 && d[i].text.indexOf(delimiter) != -1) {
            desc = d[i].text.substr(d[i].text.indexOf(delimiter) + delimiter.length);
        }
        */
        element += '<div class="description">' + desc + '</div>';
        
        //element += '<div class="photo"><img src="' + d[i].photo_807 + '" /></div>';
        element += '<div class="photo"><img src="' + d[i].src_xbig + '" /></div>';
        element += '</div>';
        rootElement.append(element);
    }
}

function createAlbumDescriptionMarkup(rootElement, data) {
    rootElement.append('<div class="album-title">' + data[0].title + '</div>');
    rootElement.append('<div class="album-description">' + data[0].description + '</div>');
}