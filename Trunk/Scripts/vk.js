var albumOwnerId = 1413115; // alexey soev 
var downloadMode = false;
var access_token = 'c0af22c0c0af22c0c0af22c0d6c0e2d315cc0afc0af22c09b9d0537ef37721dfed358f7'; // from my VK app for the site

var renameElement = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAlbum(albumId) {
    getAlbumDescription(albumId, $('#VKAlbum'), createAlbumDescriptionMarkup);
    await sleep(1000);   

    var total = 1000;
    var chank = 50;
    var count = 0;

    do 
    {
        getAlbumPhotos(albumId, $('#VKAlbum'), createAlbumMarkup, count);
        count = count + chank;
        await sleep(1000);   
    }
    while (count < total);
}

function getAlbum4Download(ownerId, albumId) {
    albumOwnerId = ownerId; // with leading minus if owner is a group, e.g "-12334567"
    downloadMode = true;
    getAlbum(albumId);
}

function getAlbumPhotos(albumId, rootElement, cb, offset) {
    
    $.ajax( {
        url: "https://api.vk.com/method/getPhotos",
        data: {
            album_id: albumId,
            owner_id: albumOwnerId,
            access_token: access_token,
            offset: offset, // in case there are more than 1000 (NOW 50!) photos in the album, take the next part
            rev: 0,
            v: 5.74
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        cb(rootElement, data.response.items, offset);
        //cb(rootElement, data.response);
    })
    .error(function (xhr, status, error) {
        console.log(err.Message);
    });
}

function getAlbumDescription(albumId, rootElement, cb) {
    
    $.ajax( {
        url: "https://api.vk.com/method/photos.getAlbums",
        data: {
            album_ids: albumId,
            owner_id: albumOwnerId,
            access_token: access_token,
            rev: 0,
            v: 5.74
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        cb(rootElement, data.response.items);
        //cb(rootElement, data.response);
    })
    .error(function (xhr, status, error) {
        console.log(err.Message);
    });
}

function createAlbumMarkup(rootElement, data, offset) {
    var d = data;
    for (i = 0; i < d.length; i++)
    {
        var element = '<div id="div'+ (i + offset)  +'" class="element" >';
         
        var desc = d[i].text;
        /*
        var delimiter = "<br><br>";
        if (i==0 && d[i].text.indexOf(delimiter) != -1) {
            desc = d[i].text.substr(d[i].text.indexOf(delimiter) + delimiter.length);
        }
        */
        element += '<div class="description">' + desc + '</div>';
        
        //element += '<div class="photo"><img src="' + d[i].photo_807 + '" /></div>';
        
        if (downloadMode == false)
        {
            if (d[i].photo_1280 != undefined)
            {
                element += '<div class="photo"><a href="' + d[i].photo_1280 + '" data-lightbox="' + d[i].pid + '"><img src="' + d[i].photo_807 + '" /></a></div>';
            }
            else if (d[i].photo_807 != undefined)
            {
                element += '<div class="photo"><img src="' + d[i].photo_807 + '" /></div>';
            }
            else
            {
                element += '<div class="photo"><img src="' + d[i].photo_604 + '" /></div>';
            }
        }
        else
        {
            var link = '';
            if (d[i].photo_2560 != undefined)
            {
                link = d[i].photo_2560;
            }
            else if (d[i].photo_1280 != undefined)
            {
                link = d[i].photo_1280;
            }
            else if (d[i].photo_807 != undefined)
            {
                link = d[i].photo_807;
            }
            else
            {
                link = d[i].photo_604;
            }

            element += '<div class="photo"><img src="' + link + '" /></div>';
            
            var newFileName = ('00000' + (i + 1 + offset)).slice(-5) + '.jpg';
            var oldFileName = link.split('/').pop();

            $('.rename-info').append('<!-- rename ' + oldFileName + ' ' + newFileName + ' -->');
        }
        
        element += '</div>';
        rootElement.append(element);
    }
}

function createAlbumDescriptionMarkup(rootElement, data) {
    rootElement.append('<div class="album-title">' + data[0].title + '</div>');
    rootElement.append('<div class="album-description">' + data[0].description + '</div>');

    rootElement.append('<div class="rename-info"></div>');

}