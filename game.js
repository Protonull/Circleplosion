var gamedata = {
	"keys":{13:"enter",32:"space",37:"left",38:"up",39:"right",40:"down",65:"a",68:"d",83:"s",87:"w"},
	"keysdown":[],
	"aspectratios":["640x360","800x450","960x540","1024x576","1280x720","1920x1080"],
	"chosenratio":0,
	"isplaying":0,
	"trashid":0,
	"hasanyonewon":0,
	"players":{},
	"entities":[],
	"playerfired":[],
	"loaded":0,
	"timer":{
		"time":0,
		"maxstep":0.5,
		"lasttime":0
	},
	"explosions":[],
	"loopcache":{},
	"loops":{
		"GameEngine":["tick","entitycheck",],
		"Game":[],
		"Player":["detectkeys","refreshhealth","autoregenerate","metrics"],
		"KeyPress":[],
		"RandomLoots":["placeloot","getloot","tickdown"]
	},
	"prototypes":["GameEngine","Entity","Game","Player","KeyPress","RandomLoots"],
	"directions":["left","down","right","up"],
	"buffs":{
		"spd":{
			"id":"spd",
			"name":"Sprint",
			"desc":"Double Speed",
			"length":"4",
			"targets":"beholder",
			"image":"images/speed.jpg"
		},
		"dmg":{
			"id":"dmg",
			"name":"Dangerous",
			"desc":"Your bullets do +10 more damage",
			"length":"3",
			"targets":"beholder",
			"image":"images/onfire.jpg"
		},
		"regen":{
			"id":"regen",
			"name":"Swift Recovery",
			"desc":"You regenerate +12 more health per second",
			"length":"7",
			"targets":"beholder",
			"image":"images/regenerate.jpg"
		},
		"slw":{
			"id":"slw",
			"name":"Numb Feet",
			"desc":"Half Speed",
			"length":"2",
			"targets":"enemy",
			"image":"images/ice.jpg"
		},
		"psh":{
			"id":"psh",
			"name":"Pea Shooter",
			"desc":"Your bullets barely do any damage",
			"length":"10",
			"targets":"enemy",
			"image":"images/gun.jpg"
		},
		"bld":{
			"id":"bld",
			"name":"Bleeding Out",
			"desc":"You are no longer regenerating",
			"length":"4",
			"targets":"enemy",
			"image":"images/targetted.jpg"
		}
	},
	"loot":""
};

function GameEngine(){}
function Entity(){}
function Game(){}
function Player(){}
function KeyPress(){}
function RandomLoots(){}

//// Game Enginge Code
GameEngine.prototype.loadgame = function(){
	if(gamedata['loaded'] == 0){
		gamedata['loaded'] = 1;
		$('body').append('<table id="body2table"><tr id="body2tabletr"><td id="body2"><br></td></tr></table>');
		$('#body2table').stop().animate({'opacity':'1','margin-top':'-195'},1000,function(){
			$('#body2').append('<button id="playgame">Play Game</button><br><br>');
			$('#body2').append('<select id="chooseaspect"></select>');
			for(var x =0;x<=gamedata['aspectratios'].length;x++){
				if(gamedata['aspectratios'][x] !== undefined){
					$('#chooseaspect').append('<option value="'+x+'">'+gamedata['aspectratios'][x]+'</option>')
				}
			}
			$('#chooseaspect').change(function(){Game.prototype.resize(parseInt($(this).val()))});
			$('#playgame').click(function(){
				setTimeout(function(){Game.prototype.start()},710);
				$('#playgame,#chooseaspect').fadeOut(700,function(){$(this).remove()});
			});
		});
	}
}
GameEngine.prototype.loop = function(){
	if(gamedata['isplaying']==1){
		for(var l in gamedata['loops']){
			var thislooparray = gamedata['loops'][l];
			for(var ls in thislooparray){
				var thisloop = thislooparray[ls];
				if(typeof eval(l+'.prototype.'+thisloop) == 'function'){
					eval(l+'.prototype.'+thisloop+'()')
				}
			}
		}
	}
	var loop = GameEngine.prototype.loop;
	return window.requestAnimationFrame(loop) || window.webkitRequestAnimationFrame(loop) || window.mozRequestAnimationFrame(loop) || window.oRequestAnimationFrame(loop) || window.msRequestAnimationFrame(loop) || window.setTimeout(loop,(1000/60));
}
GameEngine.prototype.tick = function(){
	var nowtime = Date.now();
	var walldelta = (nowtime - gamedata['timer']['lasttime']) / 1000;
	gamedata['timer']['lasttime'] = nowtime;
	var gamedelta = Math.min(walldelta,gamedata['timer']['maxstep']);
	gamedata['timer']['time'] = gamedata['timer']['time'] + gamedelta;
}
GameEngine.prototype.distance = function(baselocation,awaylocation,radius){
	if(typeof baselocation == 'object' && typeof awaylocation == 'object' && typeof radius == 'number'){
		var baseplusleft = parseInt(baselocation['left']) - parseInt(radius);
		var baseplusright = parseInt(baselocation['left']) + parseInt(radius);
		var baseplustop = parseInt(baselocation['top']) - parseInt(radius);
		var baseplusbottom = parseInt(baselocation['top']) + parseInt(radius);
		if((awaylocation['left'] >= baseplusleft && awaylocation['left'] <= baseplusright) && (awaylocation['top'] >= baseplustop && awaylocation['top'] <= baseplusbottom)){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}
GameEngine.prototype.placerelativeposition = function(location,object){
	if(typeof location == 'object' && typeof object == 'string'){
		var locleft = parseInt(location['left']);
		locleft = locleft - ($('#'+object).outerWidth(true) / 2);
		var loctop = parseInt(location['top']);
		loctop = loctop - ($('#'+object).outerHeight(true) / 2);
		return {"left":locleft,"top":loctop};
	}
	else{
		return false;
	}
}


//// KeyPress Code
$(document).keydown(function(e){KeyPress.prototype.onkeydown(e.keyCode)}).keyup(function(e){KeyPress.prototype.onkeyup(e.keyCode)});
KeyPress.prototype.onkeyup = function(keycode){
	if(gamedata['keysdown'].indexOf(keycode)!==-1){
		gamedata['keysdown'].splice(gamedata['keysdown'].indexOf(keycode),1)
	}
}
KeyPress.prototype.onkeydown = function(keycode){
	if(gamedata['keysdown'].indexOf(keycode)==-1){
		gamedata['keysdown'].push(keycode)
	}
}
KeyPress.prototype.iskeydown = function(name){
	if(typeof name == 'string'){
		var keyresult = -1;
		for(var x in gamedata['keys']){
			if(gamedata['keys'][x] == name.toLowerCase()){
				keyresult = x;
			}
		}
		if(keyresult !== -1){
			if(gamedata['keysdown'].indexOf(parseInt(keyresult)) !== -1){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}


//// Entity Code
Entity.prototype.addentity = function(name){
	if(typeof name == 'string' && gamedata['entities'].indexOf(name) == -1 && gamedata['isplaying']==1){
		gamedata['entities'].push(name);
		return true;
	}
	else{
		return false;
	}
}
Entity.prototype.removeentity = function(name){
	if(typeof name == 'string' && gamedata['entities'].indexOf(name) !== -1 && gamedata['isplaying']==1){
		gamedata['entities'].splice(gamedata['entities'].indexOf(name),1);
		$('#'+name).stop().remove();
		return true;
	}
	else{
		return false;
	}

}


//// Game Code
Game.prototype.start = function(){
	gamedata['isplaying'] = 0;
	for(var e in gamedata['explosions']){delete gamedata['explosions'][e];}
	for(var d in gamedata['players']){delete gamedata['players'][d];}
	$('#player1,#player2,#hp1,#hp2').remove();
	$('#body2').append('<img src="" id="player1" class="player"/>');
	$('#body2').append('<img src="" id="player2" class="player"/>');
	$('#body2').append('<div id="hp1" class="healthbar"><div id="hpb1" class="healthstatus"></div></div>');
	$('#body2').append('<div id="hp2" class="healthbar"><div id="hpb2" class="healthstatus"></div></div>');
	$('#body2').append('<div id="buffbar1" class="buffbar"></div>');
	$('#body2').append('<div id="buffbar2" class="buffbar"></div>');
	var bodywidth = parseInt($('#body2').outerWidth(true));
	var bodyheight = parseInt($('#body2').outerHeight(true));
	var hpdiff = parseInt($('.healthbar').outerWidth(true)) - parseInt($('.player').outerWidth(true));
	$('#player1').css({'top':(bodyheight / 2) - (parseInt($('#player1').outerHeight(true)) / 2),'left':'100'});
	$('#hp1').css({'top':(bodyheight / 2) - (parseInt($('#player1').outerHeight(true)) / 2) - 10,'left':100 - (hpdiff / 2)});
	$('#player2').css({'top':(bodyheight / 2) - (parseInt($('#player2').outerHeight(true)) / 2),'left':(bodywidth - 100) - (parseInt($('#player2').outerWidth(true)))});
	$('#hp2').css({'top':(bodyheight / 2) - (parseInt($('#player2').outerHeight(true)) / 2) - 10,'left':(bodywidth - 100) - (parseInt($('#player2').outerWidth(true))) - (hpdiff / 2)});
	$('#buffbar1').css({'left':2,'top':2});
	$('#buffbar2').css({'left':(bodywidth - 20),'top':2});
	gamedata['players']['player1'] = {
		"health":100,
		"location":get_central_location('player1'),
		"truelocation":{
			"left":0,
			"top":0
		},
		"metrics":{
			"width":0,
			"height":0
		},
		"buffs":[]
	}
	gamedata['players']['player2'] = {
		"health":100,
		"location":get_central_location('player2'),
		"truelocation":{
			"left":0,
			"top":0
		},
		"metrics":{
			"width":0,
			"height":0
		},
		"buffs":[]
	}
	for(var prt in gamedata['prototypes']){
		var thisprototype = gamedata['prototypes'][prt];
		if(thisprototype !== 'Game' && typeof eval(thisprototype+'.prototype.start') == 'function'){
			eval(thisprototype+'.prototype.start()')
		}
	}
	gamedata['isplaying'] = 1;
	gamedata['hasanyonewon'] = 0;
}
Game.prototype.resize = function(ar){
	if(typeof ar == 'number' && gamedata['isplaying'] == 0){
		var newratio = gamedata['aspectratios'][ar];
		var ratiowidth = newratio.split('x')[0];
		var ratioheight = newratio.split('x')[1];
		$('#body2table').stop().animate({
			'width':ratiowidth,
			'min-width':ratiowidth,
			'max-width':ratiowidth,
			'height':ratioheight,
			'min-height':ratioheight,
			'max-height':ratioheight,
			'margin-left':0 - (ratiowidth / 2),
			'margin-top':0 - (ratioheight / 2)
		},1000);
	}
	else{
		return false;
	}
}
Game.prototype.dodamage = function(amount,whoto){
	if(typeof amount == 'number' && typeof whoto == 'string' && typeof gamedata['players'][whoto] == 'object' && gamedata['isplaying']==1){
		var thisplayer = gamedata['players'][whoto];
		var health = thisplayer['health'];
		health = health - parseInt(amount);
		if(health < 0){health = 0;}
		gamedata['players'][whoto]['health'] = health;
		return true;
	}
	else{
		return false;
	}
}
Game.prototype.explodecollision = function(){
	if(gamedata['isplaying']==1){
		for(var i=0;i<=gamedata['explosions'].length;i++){
			if(typeof gamedata['explosions'][i] == 'object'){
				var thisexplosion = gamedata['explosions'][i];
				for(var xp in gamedata['players']){
					if(typeof xp == 'string'){
						var areinradius = GameEngine.prototype.distance({"left":thisexplosion['left'],"top":thisexplosion['top']},get_central_location(xp),parseInt(gamedata['explosions'][i]['radius']));
						if(areinradius == true){
							Game.prototype.dodamage(gamedata['explosions'][i]['damage'],xp)
						}
					}
				}
			}
			delete gamedata['explosions'][i];
		}
	}
}
Game.prototype.shoot = function(from,to,plusspeed,plusdamage){
	if(typeof from == 'object' && typeof to == 'object' && typeof plusspeed == 'number' && typeof plusdamage == 'number' && gamedata['isplaying']==1){
		var fromleft = parseInt(from['left']);
		var fromtop = parseInt(from['top']);
		var toleft = parseInt(to['left']);
		var totop = parseInt(to['top']);
		var bulletspeed = 13 + (plusspeed);
		var bulletdamage = 10 + (plusdamage);
		var distanceleft = get_difference(fromleft,toleft);
		var distancetop = get_difference(fromtop,totop);
		var distance = Math.sqrt((Math.pow(distanceleft,2)) + (Math.pow(distancetop,2)));
		var animtime = distance / (bulletspeed / 10);
		var bulletid = give_trash_number('bullet');
		Entity.prototype.addentity(String(bulletid));
		$('#body2').append('<div class="bullet" id="'+bulletid+'"></div>');
		$('#'+bulletid).css({
			'left':fromleft,
			'top':fromtop
		})
		.animate({
			'left':toleft,
			'top':totop
		},animtime,'linear',function(){
			Entity.prototype.removeentity(String(bulletid));
			gamedata['explosions'].push({"left":toleft,"top":totop,"radius":40,"damage":bulletdamage});
			Game.prototype.explodecollision();
			for(var x = 0;x<=20;x++){
				var debrisid = give_trash_number('bullet_debris');
				Entity.prototype.addentity(String(debrisid));
				$('#body2').append('<div class="debris" id="'+debrisid+'" style="left:'+toleft+';top:'+totop+';"></div>');
				var gototop = random_numer((parseInt($('#'+debrisid).css('top')) - 30),(parseInt($('#'+debrisid).css('top')) + 30));
				var gotoleft = random_numer((parseInt($('#'+debrisid).css('left')) - 30),(parseInt($('#'+debrisid).css('left')) + 30));
				var distancedifferenceleft = get_difference(parseInt($('#'+debrisid).css('left')),gotoleft);
				var distancedifferencetop = get_difference(parseInt($('#'+debrisid).css('top')),gototop);
				var debirspeed = random_numer(2,5);
				var debrisdistance = Math.sqrt((Math.pow(distancedifferenceleft,2)) + (Math.pow(distancedifferencetop,2)));	
				var debrisanitime = debrisdistance / (debirspeed / 50);
				$('#'+debrisid).animate({
					'left':gotoleft,
					'top':gototop,
					'opacity':'0'
				},debrisanitime,'linear',function(){
					Entity.prototype.removeentity($(this).attr('id'));
				});
			}
		});
	}
}


//// Player Code
Player.prototype.start = function(){
	gamedata['loopcache']['shot'] = {};
	for(var x in gamedata['players']){
		if(typeof gamedata['players'][x] == 'object'){
			gamedata['loopcache']['shot'][x+'fired'] = 0;
		}
	}
	gamedata['loopcache']['autoregenerate'] = {};
	gamedata['loopcache']['autoregenerate']['lastsecond'] = 0;
}
Player.prototype.metrics = function(){
	if(gamedata['isplaying']==1){
		for(var x in gamedata['players']){
			gamedata['players'][x]['location'] = get_central_location(x);
			gamedata['players'][x]['truelocation'] = {
				"left":($('#'+x).position().left),
				"top":($('#'+x).position().top)
			}
			gamedata['players'][x]['metrics'] = {
				"width":($('#'+x).outerWidth(true)),
				"height":($('#'+x).outerHeight(true)),
			};
		}
	}
}
Player.prototype.autoregenerate = function(){
	if(gamedata['isplaying']==1 && parseInt(gamedata['timer']['time']) > gamedata['loopcache']['autoregenerate']['lastsecond']){
		gamedata['loopcache']['autoregenerate']['lastsecond'] = parseInt(gamedata['timer']['time']);
		for(var x in gamedata['players']){
			var health = gamedata['players'][x]['health'];
			health = health + 3;
			if(Player.prototype.hasbuff(x,'regen') !== false){health = health + 12;}
			else if(Player.prototype.hasbuff(x,'bld') !== false){health = health - 3;}
			if(health > 100){health = 100;}
			gamedata['players'][x]['health'] = health;
		}
	}
	else{
		return false;
	}
}
Player.prototype.refreshhealth = function(){
	if(gamedata['isplaying']==1){
		for(var x in gamedata['players']){
			if(typeof gamedata['players'][x] == 'object'){
				var playerid = x;
				var playerno = parseInt(playerid.replace(/\D/g,""));
				var playerhp = parseInt(gamedata['players'][x]['health']);
				var healthwidth = String(playerhp+'%');
				$('#hpb'+playerno).css({
					'width':(healthwidth),
					'min-width':(healthwidth),
					'max-width':(healthwidth),
				});
				if(playerhp > 70){
					$('#hpb'+playerno).css({
						'background':'#16911A'
					});
				}
				else if(playerhp < 70 && playerhp > 30){
					$('#hpb'+playerno).css({
						'background':'#EDAE00'
					});
				}
				else if(playerhp < 30 && playerhp > 0){
					$('#hpb'+playerno).css({
						'background':'#E62E2E'
					});
				}
				else if(playerhp <= 0){
					if(playerno == 1){console.log('won by player 2')}
					else if(playerno == 2){console.log('won by player 1')}
				}
			}
		}
	}
}
Player.prototype.detectkeys = function(){
	if(gamedata['isplaying']==1){
		if(KeyPress.prototype.iskeydown('w')==true && KeyPress.prototype.iskeydown('s')==false){Player.prototype.move('up','player1')}
		else if(KeyPress.prototype.iskeydown('w')==false && KeyPress.prototype.iskeydown('s')==true){Player.prototype.move('down','player1')}
		if(KeyPress.prototype.iskeydown('a')==true && KeyPress.prototype.iskeydown('d')==false){Player.prototype.move('left','player1')}
		else if(KeyPress.prototype.iskeydown('a')==false && KeyPress.prototype.iskeydown('d')==true){Player.prototype.move('right','player1')}
		if(KeyPress.prototype.iskeydown('up')==true && KeyPress.prototype.iskeydown('down')==false){Player.prototype.move('up','player2')}
		else if(KeyPress.prototype.iskeydown('up')==false && KeyPress.prototype.iskeydown('down')==true){Player.prototype.move('down','player2')}
		if(KeyPress.prototype.iskeydown('left')==true && KeyPress.prototype.iskeydown('right')==false){Player.prototype.move('left','player2')}
		else if(KeyPress.prototype.iskeydown('left')==false && KeyPress.prototype.iskeydown('right')==true){Player.prototype.move('right','player2')}
		if(KeyPress.prototype.iskeydown('space')==true){Player.prototype.fire('player1','player2')}else{gamedata['loopcache']['shot']['player1fired'] = 0;}
		if(KeyPress.prototype.iskeydown('enter')==true){Player.prototype.fire('player2','player1')}else{gamedata['loopcache']['shot']['player2fired'] = 0;}
	}
}
Player.prototype.move = function(direction,playername){
	if(typeof direction == 'string' && typeof playername == 'string' && gamedata['directions'].indexOf(direction) !== -1 && document.getElementById(playername) && gamedata['isplaying']==1){
		var player = gamedata['players'][playername];
		var speed = 4;
		if(Player.prototype.hasbuff(playername,'spd') !== false){speed = speed * 2;}
		else if(Player.prototype.hasbuff(playername,'slw') !== false){speed = speed / 2;}
		var playerwidth = player['metrics']['width'];
		var playerheight = player['metrics']['height'];
		var playerleft = player['truelocation']['left'];
		var playertop = player['truelocation']['top'];
		var windowwith = parseInt($('#body2').outerWidth(true));
		var windowheight = parseInt($('#body2').outerHeight(true));
		var healthid = playername.replace(/\D/g,"");
		var hpdiff = parseInt($('.healthbar').outerWidth(true)) - playerwidth;
		if(direction == 'left'){
			var destination = (playerleft - (speed + 2));
			if(destination < 5){destination=5;}
			$('#'+playername).css({'left':destination});
			$('#hp'+healthid).css({'left':(destination - (hpdiff / 2))});
		}
		else if(direction == 'right'){
			var destination = (playerleft + speed);
			if(destination > (windowwith - playerwidth - 5)){destination=((windowwith - playerwidth) - 5);}
			$('#'+playername).css({'left':destination});
			$('#hp'+healthid).css({'left':(destination - (hpdiff / 2))});
		}
		else if(direction == 'up'){
			var destination = (playertop - (speed + 2));
			if(destination < 5){destination=5;}
			$('#'+playername).css({'top':destination});
			if(destination < 10){$('#hp'+healthid).css({'top':(destination + 30)})}
			else{$('#hp'+healthid).css({'top':(destination - 10)})}
		}
		else if(direction == 'down'){
			var destination = (playertop + speed);
			if(destination > (windowheight - playerheight - 5)){destination=(windowheight - playerheight - 5);}
			$('#'+playername).css({'top':destination});
			$('#hp'+healthid).css({'top':(destination - 10)});
		}
	}
	else{
		return false;
	}
}
Player.prototype.fire = function(mename,enemyname){
	if(typeof mename == 'string' && typeof enemyname == 'string' && gamedata['loopcache']['shot'][mename+'fired'] == 0 && gamedata['isplaying']==1){
		gamedata['loopcache']['shot'][mename+'fired'] = 1;
		var fromloc = get_central_location(mename);
		var toloc = get_central_location(enemyname);
		var addbulletspeed = 0;
		var addbulletdamage = 0;
		if(Player.prototype.hasbuff(mename,'dmg') !== false){addbulletdamage = 10;}
		else if(Player.prototype.hasbuff(mename,'psh') !== false){addbulletdamage = -7;}
		Game.prototype.shoot(fromloc,toloc,addbulletspeed,addbulletdamage);
		return true;
	}
	else{
		return false;
	}
}
Player.prototype.hasbuff = function(player,buffid){
	if(typeof player == 'string' && typeof buffid == 'string' && gamedata['isplaying']==1){
		var checkbuffsearch = -1;
		for(var hbc = 0;hbc<=gamedata['players'][player]['buffs'].length;hbc++){
			if(typeof gamedata['players'][player]['buffs'][hbc] !== 'undefined'){
				var thisbuff = gamedata['players'][player]['buffs'][hbc];
				var thisid = thisbuff['id'];
				if(thisid == buffid){
					checkbuffsearch = hbc;
				}
			}
		}
		if(checkbuffsearch !== -1){
			return checkbuffsearch;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}


//// RandomLoots code
RandomLoots.prototype.start = function(){
	gamedata['loopcache']['loot'] = {};
	gamedata['loopcache']['loot']['lastsecond'] = 0;
	gamedata['loopcache']['loot']['tickdownsecond'] = 0;
}
RandomLoots.prototype.tickdown = function(){
	if(gamedata['isplaying']==1 && parseInt(gamedata['timer']['time']) > gamedata['loopcache']['loot']['tickdownsecond']){
		gamedata['loopcache']['loot']['tickdownsecond'] = parseInt(gamedata['timer']['time']);
		for(var x in gamedata['players']){
			var buffs = gamedata['players'][x]['buffs'];
			for(var bfs in buffs){
				if(typeof buffs[bfs] !== 'undefined'){
					var thistimeremaining = buffs[bfs]['timeleft'];
					thistimeremaining = thistimeremaining - 1;
					gamedata['players'][x]['buffs'][bfs]['timeleft'] = thistimeremaining;
					if(thistimeremaining == -1){
						$('#buff_'+x+'_'+buffs[bfs]['id']).stop().remove();
						delete buffs[bfs];
					}
				}
			}
		}
	}
	else{
		return false;
	}
}
RandomLoots.prototype.placeloot = function(){
	if(gamedata['isplaying']==1 && get_difference(parseInt(gamedata['timer']['time']),gamedata['loopcache']['loot']['lastsecond']) >= 5){
		gamedata['loopcache']['loot']['lastsecond'] = parseInt(gamedata['timer']['time']);
		var middlelocleft = (parseInt($('#body2').outerWidth(true)) / 2);
		var middleloctop = (parseInt($('#body2').outerHeight(true)) / 2);
		var parsebuffs = Object.keys(gamedata['buffs']);
		var thebufftoplace = gamedata['buffs'][parsebuffs[parsebuffs.length * Math.random() << 0]];
		gamedata['loot'] = thebufftoplace['id'];
		$('.placedbuff').stop().remove();
		$('#body2').append('<img id="buff_buff" class="placedbuff" effect="'+thebufftoplace['id']+'" src="'+thebufftoplace['image']+'">');
		$('#buff_buff').css({
			'left':middlelocleft,
			'top':middleloctop,
			'margin-left':'-10',
			'margin-top':'-10',
		});
	}
	else{
		return false;
	}
}
RandomLoots.prototype.getloot = function(){
	if(gamedata['isplaying']==1 && gamedata['loot'] !== ''){
		for(var x in gamedata['players']){
			if(typeof gamedata['players'][x] == 'object'){
				var playerlocleft = gamedata['players'][x]['location']['left'];
				var playerloctop = gamedata['players'][x]['location']['top'];
				var bufflocleft = (parseInt($('#body2').outerWidth(true)) / 2);
				var buffloctop = (parseInt($('#body2').outerHeight(true)) / 2);
				var inradius = GameEngine.prototype.distance(gamedata['players'][x]['location'],{"left":bufflocleft,"top":buffloctop},30);
				if(inradius == true){
					var thisloot = gamedata['loot'];
					if(thisloot !== ''){
						gamedata['loot'] = '';
						var buffdetails = gamedata['buffs'][thisloot];
						var bufflength = (parseInt(buffdetails['length']));
						var bufftarget = buffdetails['targets'];
						var playernum = parseInt(x.replace(/\D/g,""));
						var targetnum = 0;
						if(bufftarget == 'enemy'){
							if(playernum == 1){targetnum = 2;}
							else if(playernum == 2){targetnum = 1;}
						}
						else{
							targetnum = playernum;
						}
						var doesplayeralreadyhavebuff = Player.prototype.hasbuff(x,thisloot);
						if(doesplayeralreadyhavebuff == false){
							gamedata['players']['player'+targetnum]['buffs'].push({"id":thisloot,"timeleft":bufflength});
						}
						else{
							gamedata['players']['player'+targetnum]['buffs'][doesplayeralreadyhavebuff]['timeleft'] = bufflength;
						}
						var buffeffectid = give_trash_number('buff_effect');
						Entity.prototype.addentity(String(buffeffectid));
						$('#body2').append('<img id="'+buffeffectid+'" class="buffeffect" src="'+$('#buff_buff').attr('src')+'">');
						$('#'+buffeffectid).css({'left':($('#buff_buff').position().left),'top':($('#buff_buff').position().top),'margin-left':'-10','margin-top':'-10','width':'10','height':'10'});
						var newbuffname = 'buff_player'+targetnum+'_'+thisloot;
						$('#buff_buff').attr('id',newbuffname).attr('class','playerbuff').css({'position':'relative','left':'0','top':'0','margin-top':'0','margin-left':'0','width':'10','height':'10','display':'none'}).appendTo('#buffbar'+targetnum);
						$('#'+buffeffectid).animate({
						    left:[($('#buffbar'+targetnum).position().left + 5),'easeInSine'],
						    top:($('#buffbar'+targetnum).position().top + 5),
						    'width':'10',
						    'height':'10'
						},1000,function(){
							Entity.prototype.removeentity(String(buffeffectid));
							$('#'+newbuffname).css({'display':'block'});
						});
					}
				}
			}
		}
	}
}




function random_numer(from,to){return Math.floor(Math.random()*(to-from+1)+from);}
function get_central_location(docid){if(!document.getElementById(docid)){return false;}else{var thisobj = $('#'+docid);return {"left":(thisobj.position().left + (thisobj.outerWidth(true) / 2)),"top":(thisobj.position().top + (thisobj.outerHeight(true) / 2))};}}
function is_playing(){if(gamedate['isplaying']==1){return true;}else{return false;}}
function get_difference(num1,num2){if(num1 < num2){return num2 - num1;}else if(num1 == num2){return 0;}else{return num1 - num2;}}
function loadimagefrominput(event,imageid){if(document.getElementById(imageid)){var selectedFile = event.target.files[0];var reader = new FileReader();var imgtag = document.getElementById(imageid);imgtag.title = selectedFile.name;reader.onload = function(event){imgtag.src = event.target.result;};reader.readAsDataURL(selectedFile);return true;}else{return false;}}
function give_trash_number(name){if(typeof name == 'string'){gamedata['trashid'] = gamedata['trashid'] + 1;return name + '_' + gamedata['trashid'];}else{return false;}}

$(document).ready(function(){GameEngine.prototype.loadgame();GameEngine.prototype.loop();});










