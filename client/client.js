
//Suscripciones a las colecciones
Meteor.subscribe("useNames");
Meteor.subscribe("gameplays");
Meteor.subscribe("messages");
//INTEGRACION
Meteor.subscribe("turnoIU");

//Para tener acceso a Stats
Meteor.subscribe("all_stats");

//Solo si eres el creador mandamos peticion al servidor para cambiar el estado de la partida
function gameReady() {
    var gameplays = Gameplays.find({status: false});
    gameplays.forEach(function (gameplay) {
        if ((gameplay.num_players == gameplay.max_players) &&
            (gameplay.creator_id == Meteor.userId())) {
            begin = true;
            //Cambiamos el status del gameplay
            Gameplays.update({_id: gameplay._id}, {$set: {status: true}});
        }   
    });
}

//Si eres jugador, comprobamos si tu partida esta empezada y llamammos al canvas
function partidaEmpezada() {
    var empezada = false;
    var gameplays = Gameplays.find({});
    var idusuario = Meteor.userId();
    gameplays.forEach(function (gameplay) {
        if ((gameplay.gameplay_list.indexOf(idusuario) != -1) && (gameplay.status == true))  {
		empezada = true;
		$('#container_lateral1').hide();
		$('#container_lateral2').hide();
		$('#container_principal').show();
		Session.set('tab', null);
		//INTEGRACION 1
		if (gamelock == false) {
			//Supongo que esto lo llaman todos los jugadores
			EmpezarTodo(gameplay._id, gameplay.gameplay_list, idusuario);
		}
		//
        }   
    });
    return empezada;
}

//Cuando no tenemos una partida empezada desbloqueamos
var gamelock = false;
Tracker.autorun(function(){
    var current_Stat = Session.get("current_Stat");
    gameReady();
    if (partidaEmpezada() == true) {
        gamelock = true;
    }
    else {
        gamelock = false;
	$('#container_lateral1').show();
        $('#container_lateral2').show();
        $('#container_principal').hide();     
    }
});

var reactiva = null;
Tracker.autorun(function() {
	reactiva = Turno.find();
	reactiva.forEach(function(m) {
		if (Meteor.userId() != User_IdIA) {
			if (!m.scroll) {
				if (m.Comando === "PedirPieza") {
					if (!m.rotacion) {            
						var piezaNueva = new pieza (m.nombrePieza, 11.5*64, 8*64, false, 0, false);
						board.add(piezaNueva);
					} else {
						rotacionTracker = [m.rotacion, m.numRotacion];
					}
				} else if(m.Comando === "ColocarPieza") {
					colocadaTracker = true;
					xTracker = m.posx;
					yTracker = m.posy;
					xIA = m.casillaX;
					yIA = m.casillaY;
				} else if (m.Comando === "ColocarSeguidor") {
					colocadoSegTracker = true;
					xsegTracker = m.posxseg;
					ysegTracker = m.posyseg;
					numcolor = m.numColor; 
				} else if (m.Comando === "BorrarSeguidor") {
					var array = m.arrayQuitarSeg;
					array.forEach(function (e, i) {						
						borrarSeguidor(e.x, e.y);
					});
				} else if (m.Comando === "ActualizarTurno") {
					JugadoresIA = m.Jugadores;
					User_IdIA = m.User_id;
					if (Meteor.userId() === User_IdIA){
						numcolor = m.numColor;
						otrapieza = true;
						DejarScroll = true;
						Game.setBoard(2,new TextoPideFicha("Pulsa enter para pedir ficha ",playGame));
					}
					Game.setBoard(1,new Jugadores(JugadoresIA));
				} else if (m.Comando === "JugadaIA") {
					var piezaNueva = new pieza (m.nombrePieza, m.posx, m.posy, true, m.numRotacion, true);
					board.add(piezaNueva);
					numcolor = m.numColor;
					if (m.posxseg !=0 && m.posyseg !=0) {
						var seguidor = new Seguidor (m.posxseg, m.posyseg,verColorSeg(), m.casillaX, m.casillaY);
						board.add (seguidor);
					}
				} else if (m.Comando === "FinPartida") {
					Game.setBoard(6,new final(m.resumenFinal));   
				} else if (m.Comando === "FinPL") {
					partidaTerminada(m.objetoPL);
				}
			} else {
				DejarScroll = true;
				ladoScrollTracker = m.ladoscroll;
				contadorScroll++;	
			}
		} else {
			if (m.Comando === "ActualizarTurno") {
				JugadoresIA = m.Jugadores;
				User_IdIA = m.User_id;
				if (Meteor.userId() === User_IdIA) {
					numcolor = m.numColor;
					otrapieza = true;
					DejarScroll = true;
					Game.setBoard(2,new TextoPideFicha("Pulsa enter para pedir ficha ",playGame));
				}
				Game.setBoard(1,new Jugadores(JugadoresIA));
			} else {
				JugadoresIA = m.Jugadores;
				User_IdIA = m.User_id;
				Game.setBoard(1,new Jugadores(JugadoresIA));
			}
		}
	});
});

var aux_inicio = false;
var aux_creat_id = undefined;
// Pruebas con Tracker.autorun
Tracker.autorun(function(){
	current_game = Session.get('partida_actual');
	game = Gameplays.findOne({_id: current_game});
	if (game === undefined){	
		if ((aux_inicio === true) && (aux_creat_id !== Meteor.userId())){
			alert ("La partida ha sido borrada por marcha del creador");
			changeView('partidas');
		}
		changeView('partidas');

	}else{
		aux_creat_id = game.creator_id;
	}
	aux_inicio= true;
});

Meteor.startup(function () {
	Session.set('tab', null);
	Session.set("current_Stat", "Otros");				    	
});

//Funciones del programa
function changeView(view) {
	Session.set('tab', view);
}

//Función general. Si has creado una partida has entrado en una partida creada estás en espera
function estaenespera() {
    var esta = false;
    var gameplays = Gameplays.find({});
    var idusuario = Meteor.userId();
    gameplays.forEach(function (gameplay) {
        if (gameplay.gameplay_list.indexOf(idusuario) != -1) {
            esta = true;
        }   
    });
    return esta;
}

//Funcion especifica
function hacreadopartida() {
    var escreador = false;
    var gameplays = Gameplays.find({});
    var idusuario = Meteor.userId();
    gameplays.forEach(function (gameplay) {
        if (gameplay.creator_id == idusuario) {
            escreador = true;
        }   
    });
    return escreador;
}

function maxcurrentgameplayers() {
    var maxplayers = -1;
    var gameplays = Gameplays.find({});
    var idusuario = Meteor.userId();
    gameplays.forEach(function (gameplay) {
        if (gameplay.gameplay_list.indexOf(idusuario) != -1) {
            maxplayers = gameplay.max_players;
        }   
    });
    return maxplayers;
}

function mostrarTodo() {
    $('#container_lateral1').show();
    $('#container_lateral2').show();
    $('#container_principal').hide();
}

function ocultarTodo() {
    $('#container_lateral1').hide();
    $('#container_lateral2').hide();
    $('#container_principal').show();
}

//Manejadores de eventos
Template.userlist.helpers({
	users: function(){
		return Meteor.users.find( {_id: {$ne: Meteor.userId()}});
	}
});

Template.userlist.events({
	'click input.addfriend': function(event){
			Meteor.call('addFriend', ($(this)[0])._id);
			console.log(($(this)[0]));		
	}
});

Template.amigos.helpers({
	friend_connect: function(){
		friend_list = Meteor.user().friend_list;
		if (friend_list !== undefined)
			return Meteor.users.find({$and: [{_id: {$in: friend_list, $ne: Meteor.userId()}}, {'services.resume.loginTokens': {$ne: []}}]});
	}, 
	friend_disconnect: function(){
		friend_list = Meteor.user().friend_list;
		if (friend_list !== undefined)
			return Meteor.users.find({$and: [{_id: {$in: friend_list}}, {'services.resume.loginTokens': []}]});
	}	
}); 

Template.amigos.events({
	'click input.deletefriend': function (event) {
		Meteor.call('deleteFriend', ($(this)[0])._id);	
	}	
});

Template.chatemp.helpers({
	messages: function(){
		return Messages.find({},{limit: 12, sort:{time: -1}});
	} 
}); 

Template.chatemp.events({
	'keydown input#chatinput': function (event) {
		if (event.which == 13) {
			if (Meteor.userId()){
				var user_id = Meteor.user()._id;
				var name = Meteor.user().username;
				var message = $('input#chatinput');
				if (message.value != '') {
					Messages.insert({
						user_id: user_id,
						name: name,
						message: message.val(),
						time: Date.now()
					});
 		 			message.val('')	
				}
			}
		}  
	}	
});

Template.crear_partida.events({
	'submit': function (event, tmpl){
	    var formulariocorrecto = false;
	    var max_players = parseInt(tmpl.find('#jugadores').value);
        if (isNaN(max_players)) {
	        alert("Tienes que introducir un número de jugadores para poder crear una partida. No puedes dejarlo en blanco");
	        formulariocorrecto = false;
	    }
	    else {
	        formulariocorrecto = true;
	    }
	    //Solo puede intentar crear una partida si está logueado
		if (Meteor.userId()) {
		    if (formulariocorrecto) {
   			    if (estaenespera() == false) {
    			    var gameplay_name = $('input#partidainput');
    			    var existente = Gameplays.findOne({gameplay_name: gameplay_name.val()});
    			    //Si el nombre de la partida ya esta registrado le avisamos y le devolvemos a creacion de partidas
    			    if (existente != undefined){
    				    alert("Ya existe una partida con ese nombre, pon un nombre distinto");
    				    changeView('partidas');
    			    }
    			    //Si no, procedemos a crear la partida
    			    else {
    			        //Si el nombre no es nulo, le dejamos el nombre que ha elegido
    			        //Si es nulo, le ponemos un nombre por defecto
    			        gameplay_name = gameplay_name.val()
    			        if (gameplay_name == '') {
    				        gameplay_name = "Partida de "+ Meteor.user().username + " " + Meteor.userId().slice(1,5);
    				    }
    				    //Creamos la partida
    				    Meteor.call('addGameplay', gameplay_name, max_players, function(error, gameplay_id){
    					    Gameplays.update({_id : gameplay_id}, {$push: {gameplay_list: Meteor.userId()}});
    					    Session.set("partida_actual", gameplay_id);
    					    changeView('waiting');	
    				    });
    				}
    			}
    			else {
    			    //Si ha creado ya una partida le avisamos y le devolvemos a su sala de espera
    			    if (hacreadopartida()) {
    			        alert("Ya has creado una partida");
    			        changeView('waiting');
    			    }
    			    //Si está ya en una lista de espera le avisamos y le devolvemos a la sala de espera
    			    else {
    			        alert("Ya estás en una sala de espera");
    			        changeView('waiting');
    			    }
    			}
   			}		
		}
		else {
		    alert("Debes estar logueado para poder crear una partida");
		}	
	}
});

function partida_rapida() {
    //Solo puede intentar crear una partida si está logueado
	if (Meteor.userId()){
        if (estaenespera() == false) {
            //Comprobamos que haya partidas en la lista de espera
            var bestgameplay = Gameplays.find({status: false}, {sort: {num_players: -1}});
            if (bestgameplay.count() === 0) {
                alert("No hay partidas en espera. Crea tú una nueva si quieres.");
            }
            else {
            	var bazinga = false;
		        bestgameplay.forEach(function (game_play) {		            
                    if (game_play.status == false && bazinga == false) {
                        bazinga = true;
			            Gameplays.update({_id : game_play._id}, {$addToSet: {gameplay_list: Meteor.userId()}, $inc: {num_players: 1}});	
		                Session.set("partida_actual", game_play._id);
		                changeView('waiting');
		            }
                });
            }
		}
		else {
		    //Si ha creado ya una partida le avisamos y le devolvemos a su sala de espera
		    if (hacreadopartida()) {
		        alert("Ya has creado una partida");
		        changeView('waiting');
		    }
		    //Si ya está en una lista de espera le avisamos y le devolvemos a la sala de espera
		    else {
		        alert("Ya estás en una sala de espera");
		        changeView('waiting');
		    }
		}
	}
	else {
	    alert("Debes estar logueado para poder acceder una partida");
	}
}

Template.salas_de_espera.helpers({
		gameplays: function(){
			return Gameplays.find({status: false});
		}
}); 

Template.salas_de_espera.events({
    'click input.joingame': function(event){
		//Solo puede intentar entrar en una partida si está logueado
		if (Meteor.userId()){
		    if (estaenespera() == false) {
			    //($(this[0]). se refiere a una coleccion, concretamente al gameplay actual, no me gusta, pendiente de cambiar
		        var num_players = ($(this)[0]).num_players + 1 ;
		        var max_players = ($(this)[0]).max_players;
		        //El segundo campo del if es otra guarrada, directamente cuando estas en una partida no deberías poder hacer otra cosa, en vez de comprobarsi estas en (LA partida y no en TODAS las partidas, por eso tb es bastante guarro) y de alguna forma has podido crear o acceder a otra. Quitar si o si! Lo de la lista de jugadores en la partida esta bien
		        if ((num_players <= max_players) && (($(this)[0]).gameplay_list.indexOf(Meteor.userId()) === -1)) {
		        	Gameplays.update({_id : $(this)[0]._id}, {$addToSet: {gameplay_list: Meteor.userId()}, $inc: {num_players: 1}});	
		        }
		        Session.set("partida_actual", $(this)[0]._id);
		        changeView('waiting');
			}
			else {
			    if ($(this)[0].gameplay_list.indexOf(Meteor.userId()) != -1) {
			        changeView('waiting');
			    }
			    else {
			        //Si ha creado ya una partida le avisamos y le devolvemos a su sala de espera
			        if (hacreadopartida()) {
			            alert("No puedes unirte. Ya has creado una partida");
			            changeView('waiting');
			        }
			        //Si está ya en una lista de espera le avisamos y le devolvemos a la sala de espera
			        else {
			            alert("No puedes unirte. Ya estás en una sala de espera");
			            changeView('waiting');
			        }
			    }
	        }
        }
		else {
		    alert("Debes estar logueado para poder acceder a una partida");
		}
	}
});

Template.waiting.helpers({
		waiting: function(){
			return Gameplays.findOne({_id:Session.get("partida_actual")}).num_players;
		},
		players: function(){
		    var playersIds = Gameplays.findOne({_id: Session.get("partida_actual")}).gameplay_list;
		    var player_names = [];
		    for (var i=0; i < playersIds.length; i++) {
		        player_names.push(Meteor.users.findOne({_id: playersIds[i]}));
		    }
		    return player_names;
		},
		restantes: function(){
		    var num_players = Gameplays.findOne({_id: Session.get("partida_actual")}).num_players;
		    var max_players = Gameplays.findOne({_id:Session.get("partida_actual")}).max_players;
		    return (max_players - num_players)
		},
		max_players: function(){
			var max_players = Gameplays.findOne({_id:Session.get("partida_actual")}).max_players;
			return max_players;
		},
		emptyplayers: function(){
		    var num_players = Gameplays.findOne({_id: Session.get("partida_actual")}).gameplay_list.length;
		    var max_players = Gameplays.findOne({_id:Session.get("partida_actual")}).max_players;
		    var empty_players = [];
		    for (var i=0; i < (max_players - num_players); i++) {
		        empty_players.push({username: "empty"});
		    }
		    return empty_players;
		}
});

Template.waiting.events ({
	'click input.exitgame': function(event){
		if (confirm ("¿Seguro que quieres abandonar la partida?")){
			var gameplay_id =  Session.get('partida_actual')
			var current_gameplay = Gameplays.findOne({_id: gameplay_id});
			if (Meteor.userId() === current_gameplay.creator_id){
				//Gameplays.update({_id : gameplay_id}, {$set: {gameplay_list: [], gameplay_name: undefined}});
				changeView('partidas');
				Gameplays.remove({_id: gameplay_id});
				Session.set('partida_actual', undefined);					
			}
			else{
				gameplay_list = Gameplays.findOne({_id: gameplay_id}).gameplay_list;
				index = gameplay_list.indexOf(Meteor.userId());
				console.log(index);
				if (index !== -1){
					gameplay_list.splice(index,1);
					Gameplays.update({_id : gameplay_id}, {$set: {gameplay_list: gameplay_list}, $inc: {num_players: -1}});
				}
				changeView('partidas');
			}
		}
	}	
});


Template.views.helpers({
	tab: function() {
		var tab = {};
		tab['usuarios'] = Session.get('tab') === 'usuarios';
		tab['partidas'] = Session.get('tab') === 'partidas';
		tab['salas_de_espera'] = Session.get('tab') === 'salas_de_espera'
		tab['waiting'] = Session.get('tab') === 'waiting';
		tab['amigos'] = Session.get('tab') === 'amigos';
		return tab;
	}
});

Template.tabs.events({
    'click #liinicio': function () {
        if (gamelock == false) {
            Session.set('tab', null);
	        Session.set("current_Stat", "Otros");
	        mostrarTodo();
	    }
	},
	'click #licrear_partida': function () {
		changeView('partidas');
	},
	'click #lisalas_de_espera': function () {
	    if (gamelock == false) {
	        changeView('salas_de_espera');
	    }
	},	
	'click #lipartida_rapida': function () {
	    if (gamelock == false) {
	        partida_rapida();
	    }
	},
	'click #liregistro': function () {
		if (gamelock == false) {
		    changeView('usuarios');
		}
	},
	'click #liamigos': function () {
		if (gamelock == false) {
		    changeView('amigos');
		}
	},
	'click  #liPersonales': function () {
	    $('#logintroduccion').hide();
        Session.set("current_Stat", "StatsPersonales");
    },
    'click #liGeneral': function () {
        $('#logintroduccion').hide();
        Session.set("current_Stat", "MejoresGeneral");
    },
    'click  #liCarcassone': function () {
        $('#logintroduccion').hide();
        Session.set("current_Stat", "MejoresCarcassone");
    },
    'click #liOtros': function () {
        $('#logintroduccion').show();
        Session.set("current_Stat", "Otros");
    }
});

Template.viewsEstadisticas.events({
    'click #anadeStats': function () {
        var total = Estadisticas.find().count();
        Estadisticas.insert({
        	//Esto es algo temporal. El nombre que tiene es par que no se repita en la base de datos
            player_name: "Usuario "+total,
            //De momento Carcassone es el unico juego por defecto
            game_name: {game_name: "Carcassone",
                points: 20 + total,
                played_games: total,
                winned_games: total,
                drawed_games: total,
                lossed_games: total
            }
        });
    }
});

Template.viewsEstadisticas.helpers ({
    current_Stat: function() {
	var current_Stat = {};
	current_Stat['StatsPersonales'] = Session.get('current_Stat') === 'StatsPersonales';
	current_Stat['MejoresGeneral'] = Session.get('current_Stat') === 'MejoresGeneral';
	current_Stat['MejoresCarcassone'] = Session.get('current_Stat') === 'MejoresCarcassone';
	current_Stat['Otros'] = Session.get('current_Stat') === 'Otros';
	return current_Stat;
	}
});

//Solo hay que cambiar player_name : nullplayer por _id: Meteor.userId()
//Me refiero a que hay que buscar por el userID, no por nullplayer..y no se puede buscar ya, porque si no esta logueado que? que nos muestra? Da un bonito error. Vuelvo a dejarlo como estaba
Template.StatsPersonales.helpers({
    name: function(){
        var name = Estadisticas.findOne({player_name: Meteor.user().username}).player_name;
		return name;
	},
    game_name: function(){
        var game_name = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.game_name;
		return game_name;
	},
	points: function(){
	    var points = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.points;
		return points;
	},
    played_games: function(){
        var played_games = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.played_games;
		return played_games;
	},
	winned_games: function(){
	    var winned_games = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.winned_games;
		return winned_games;
	},
    drawed_games: function(){
        var drawed_games = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.drawed_games;
		return drawed_games;
	},
	lossed_games: function(){
	    var lossed_games = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.lossed_games;
		return lossed_games;
	},
    points_per_game: function(){
        var played_games = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.played_games;
        var points = Estadisticas.findOne({player_name: Meteor.user().username}).game_name.points;
        var points_per_game = Math.round(points/played_games);
		return points_per_game;
	}
});

Template.MejoresGeneral.helpers({
    topScorers: function(){
		return Estadisticas.find({}, {limit: 10, sort: {'game_name.points': -1}});
	}
});

Template.MejoresCarcassone.helpers({
    Totalplayed_games: function() {
        var Totalplayed_games = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totalplayed_games += stat.game_name.played_games;
        });
        return Totalplayed_games;
    },
    Totalwinned_games: function() {
        var Totalwinned_games = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totalwinned_games += stat.game_name.winned_games;
        });
        return Totalwinned_games;
    },
    Totaldrawed_games: function() {
        var Totaldrawed_games = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totaldrawed_games += stat.game_name.drawed_games;
        });
        return Totaldrawed_games;
    },
    Totallossed_games: function() {
        var Totallossed_games = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totallossed_games += stat.game_name.lossed_games;
        });
        return Totallossed_games;
    },
    Average_point_per_game: function() {
        var averagePoints = 0;
        var Totalpoints = 0;
        var Totalplayed_games = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totalpoints += stat.game_name.points;
            Totalplayed_games += stat.game_name.played_games;
        });
        averagePoints = Math.round(Totalpoints/Totalplayed_games);
        return averagePoints;
    },
    Totalpoints: function() {
        var Totalpoints = 0;
        var stats = Estadisticas.find({});
        stats.forEach(function (stat) {
            Totalpoints += stat.game_name.points;
        });
        return Totalpoints;
    }
});
   
/*  Configuration of signup */
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});
