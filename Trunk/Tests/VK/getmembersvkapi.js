
/*
var membersGroups = []; // массив участников группы
//getMembers(974187);

// получаем информацию о группе и её участников
function getMembers(group_id) {
	VK.Api.call('groups.getById', {group_id: group_id, fields: 'photo_50,members_count', v: '5.27'}, function(r) {
			if(r.response) {
				$('.group_info')
				.html('<img src="' + r.response[0].photo_50 + '"/><br/>' 
					+ r.response[0].name
					+ '<br/>Участников: ' + r.response[0].members_count);
				getMembers20k(group_id, r.response[0].members_count); // получем участников группы и пишем в массив membersGroups
			}
	});
}

// получаем участников группы, members_count - количество участников
function getMembers20k(group_id, members_count) {
	var code =  'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + membersGroups.length + '}).items;' // делаем первый запрос и создаем массив
			+	'var offset = 1000;' // это сдвиг по участникам группы
			+	'while (offset < 25000 && (offset + ' + membersGroups.length + ') < ' + members_count + ')' // пока не получили 20000 и не прошлись по всем участникам
			+	'{'
				+	'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + membersGroups.length + ' + offset)}).items;' // сдвиг участников на offset + мощность массива
				+	'offset = offset + 1000;' // увеличиваем сдвиг на 1000
			+	'};'
			+	'return members;'; // вернуть массив members
	
	VK.Api.call("execute", {code: code}, function(data) {
		if (data.response) {
			membersGroups = membersGroups.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив
			$('.member_ids').html('Загрузка: ' + membersGroups.length + '/' + members_count);
			if (members_count >  membersGroups.length) // если еще не всех участников получили
				setTimeout(function() { getMembers20k(group_id, members_count); }, 333); // задержка 0.333 с. после чего запустим еще раз
			else // если конец то
				alert('Ура тест закончен! В массиве membersGroups теперь ' + membersGroups.length + ' элементов.');
		} else {
			alert(data.error.error_msg); // в случае ошибки выведем её
		}
	});
}
*/

function authInfo(response) {    
    if(response.status=='connected') {	// если пользователь залогинен в ВК     
        if(typeof(response.session.user) == 'undefined') { // этого поля нет 
                //тогда, когда пользователь был залогинен ранее
                VK.Api.call('users.get', { uid: response.session.mid }, function(r) { 
                    $('#VKInfo').html(r.response[0].first_name+' '+r.response[0].last_name); 
                    $('#VKInfo').append('user_id: '+response.session.mid); });
   }else {
        // если авторизация прошла только что (от VK.Auth.login(authInfo);), то имя и фамилия уже будут в ответе   
        $('#VKInfo').html(response.session.user.first_name+' '+response.session.user.last_name);
        $('#VKInfo').append('user_id: '+response.session.mid);
	}
       }else {
        VK.Auth.login(authInfo); // опционально можем спалиться и вызвать всплывающее окно авторизации
    }
}

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
                $('body').append(element);
                
                VK.api('photos.getComments', {owner_id: 1413115, pid: d[i].pid}, function(data) {
                    if (data.response) {
                        var a = data.response;
                    } });
            }
        }
    }); 
}
 
$(function() { 

VK.init({
    apiId: 5108181 // ID вашего приложения VK
});

//VK.Auth.getLoginStatus(authInfo); 

getAlbum(221998000);


}

); // проверяем наличие входа в ВК, ответ отправляем в функцию обработчик
