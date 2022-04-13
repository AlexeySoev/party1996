var albumOwnerId = 1413115; // alexey soev 
var access_token = 'c0af22c0c0af22c0c0af22c0d6c0e2d315cc0afc0af22c09b9d0537ef37721dfed358f7'; // from my VK app for the site

//configuration params
var chankSize = 50; // defaut VK chank is 50, let's stay with it
var groupSize = 10000; // 10000 for display mode (i.e not limited). And, say, 300 photo for download mode (configued by xml page caller!)
var iteration = 1; // changed when downloading photos by groups (configued by xml page caller!) (for display it's always stay 1)
var downloadtimePerPhoto = 20 // let's give 20ms per photo to display and 1000ms to download (configued by xml page caller!)

// dynamics values
var totalPhotosInAlbum = 0;
var downloadMode = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAlbum(albumId) {
    getAlbumDescription(albumId, $('#VKAlbum'), createAlbumDescriptionMarkup);
    await sleep(3000);  // let's wait for photos count

	var start_pos = groupSize * (iteration - 1); // starting position, should be 0, but if more than 1000 photos in the album it makes sense to get them by groups (thousands, i.e. set it to 0, then 1000, then 2000 etc.)
    var stop_pos = totalPhotosInAlbum != 0 && totalPhotosInAlbum < groupSize * iteration ? totalPhotosInAlbum : groupSize * iteration ;  // total qunatity of photos in the album
	
	console.log("Start downloading photos. Start position: " + start_pos + ". Stop position: " + stop_pos + ". Group size: " + groupSize + ". Chank size: " + chankSize + ". Total photos quantity: " + totalPhotosInAlbum + ".");
    	
    var current_pos = start_pos;  
    do 
    {
		var chankNumber = (current_pos - start_pos) / chankSize + 1;
		console.log("Chank #" + chankNumber + " started.");
		
        getAlbumPhotos(albumId, $('#VKAlbum'), createAlbumMarkup, current_pos, chankSize);
        current_pos += chankSize;
        await sleep(chankSize * downloadtimePerPhoto);   
		
		console.log("Chank #" + chankNumber + " requested.");
    }
    while (current_pos < stop_pos);
	
	console.log("All photos within the range requested. Exit.");
}

function getAlbum4Download(ownerId, albumId, imageGroupSize, iterationNumber) {
    downloadMode = true;
    downloadtimePerPhoto = 1000; // increase download time since images are much bigger

    albumOwnerId = ownerId; // with leading minus if owner is a group, e.g "-12334567"
    groupSize = imageGroupSize;
    iteration = iterationNumber;

    getAlbum(albumId);
}

function getAlbumDescription(albumId, rootElement, cb) {
    
    $.ajax( {
        url: "https://api.vk.com/method/photos.getAlbums",
        data: {
            album_ids: albumId,
            owner_id: albumOwnerId,
            access_token: access_token,
            rev: 0,
            v: 5.131
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        cb(rootElement, data.response.items);
    })
    .error(function (xhr, status, error) {
        console.log(error.Message);
    });
}

function getAlbumPhotos(albumId, rootElement, cb, offset, chank) {
    
    $.ajax( {
        url: "https://api.vk.com/method/photos.get",
        data: {
            album_id: albumId,
            owner_id: albumOwnerId,
            access_token: access_token,
            offset: offset, // in case there are more than 1000 (NOW 50!) photos in the album, take the next part
			count: chank,
            rev: 0,
            v: 5.131
        },
        dataType: 'jsonp',
        async: true
    }).success(function (data) {
        cb(rootElement, data.response.items, offset);
    })
    .error(function (xhr, status, error) {
        console.log(error.Message);
    });
}

function createAlbumDescriptionMarkup(rootElement, data) {
    rootElement.append('<div class="album-title">' + data[0].title + '</div>');
    rootElement.append('<div class="album-description">' + data[0].description + '</div>');
    rootElement.append('<div class="rename-info"></div>');
	
	totalPhotosInAlbum = data[0].size;
}

function createAlbumMarkup(rootElement, data, offset) {
    var d = data;
    for (var i = 0; i < d.length; i++)
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
		
        if (downloadMode == false)
        {
			var photo_807 = getPhotoLink(d[i], 'y');
			var photo_1280 = getPhotoLink(d[i], 'z');
			
            if (photo_807 != photo_1280)
            {
                element += '<div class="photo"><a href="' + photo_1280 + '" data-lightbox="vkalbum" data-title="' + desc.replace(/[\""]/g, '') + '"><img src="' + photo_807 + '" /></a></div>';
            }
            else
            {
                element += '<div class="photo"><img src="' + photo_807 + '" /></div>';
            }
        }
        else
        {
            var link = getPhotoLink(d[i], 'w'); // max size
			
			var photoNumber = ('00000' + (i + 1 + offset)).slice(-5);
			
            element += '<div class="photo"><img src="' + link + '" title="' + photoNumber + '" /></div>';
            
            var newFileName = photoNumber + '.jpg';
            var oldFileName = link.split('/').pop();

            $('.rename-info').append('<!-- rename ' + oldFileName + ' ' + newFileName + ' -->');
        }
		
        element += '</div>';
        rootElement.append(element);
    }
}
/* new 2021 vk api
x - 640
y - 807
z - 1280
w - 2560
*/
function getPhotoLink(photoSizes, maxSizeType)
{
	var plink = '';
	var ptype = '';
	for (var i = photoSizes.sizes.length-1; i >=0 ; i--)
    {
		var photo = photoSizes.sizes[i];
		if (photo.type == 'x' && ptype == '') // 640px
		{
			plink = photo.url;
			ptype = photo.type;
		}
		else if (photo.type == 'y' && ( ptype == '' || ptype == 'x') && maxSizeType != 'x') // 807px
		{
			plink = photo.url;
			ptype = photo.type;
		}
		else if (photo.type == 'z' && ( ptype == '' || ptype == 'x' || ptype == 'y') && maxSizeType != 'x' && maxSizeType != 'y') // 1280x1024
		{
			plink = photo.url;
			ptype = photo.type;
		}
		else if (photo.type == 'w' && maxSizeType != 'x' && maxSizeType != 'y' && maxSizeType != 'z') // 2560x2048
		{
			plink = photo.url;
			break;
		}
    }
	return plink;
}