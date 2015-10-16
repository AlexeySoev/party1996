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