
//Controlamos como el servidor de METEOR publica sus colecciones y como los cliente se suscriben a ellas
Accounts.onCreateUser(function(options, user) {
    user.amigos = [];
    return user;
});

Meteor.publish("userNames", function () {
    return Meteor.users.find({}, {fields: {username:1 ,'friend_list':1, services:1}})
});

Meteor.publish("messages", function() {
	return Messages.find();
});

Meteor.publish("gameplays", function() {
	return Gameplays.find();
});

Meteor.publish("all_stats", function() {
    return Estadisticas.find();
});

//INTEGRACION
Meteor.publish("turnoIU", function() { 
	return Turno.find();
});

//Gestionamos privacidad
Gameplays.allow({  
	update: function(userId, doc) {  
	  return !! userId; 
	},
	remove: function(userId, doc) {  
	  return !! userId; 
	}
});

Messages.allow({
	insert: function(userId, doc) {  
	  return !! userId; 
	},
});

Estadisticas.allow({
    insert: function(userId, doc) {
        return Meteor.userId();
    }
});

Meteor.users.allow({
    update: function(userId, doc) {  
	  return !! userId; 
	}
});

//Metodos de METEOR
Meteor.methods({
	addGameplay: function (gameplay_name, max_players) {
		if (Meteor.userId()){
			return Gameplays.insert({
					creator_name: Meteor.user().username,
					creator_id: Meteor.userId(),
					gameplay_name: gameplay_name,
					gameplay_list: [],
					num_players: 1,
					max_players: max_players,
					status: false,
					time: Date.now(),
				});		
		}
	},
	addFriend: function (friend){
		if (Meteor.userId()){
			Meteor.users.update({_id : Meteor.userId()}, {$addToSet: {friend_list: friend}})
			Meteor.users.update({_id : friend}, {$addToSet: {friend_list: Meteor.userId()}})	
		}
	},
	deleteFriend: function (friend){
		if (Meteor.userId()){
			Meteor.users.update({_id : Meteor.userId()}, {$pull: {friend_list: friend}})	
			Meteor.users.update({_id : friend}, {$pull: {friend_list: Meteor.userId()}})	
		}
	},
	matchFinish: function (game_id, points, resultado) {
		if (Meteor.userId) {
			var creator_id = Gameplays.findOne({_id: game_id}).creator_id;
			if (creator_id === Meteor.userId()){
				Gameplays.remove({_id: game_id});
			}
			var defeat = 0;
			var victory = 0;
			if (resultado === 1) {
				victory = 1;
			}
			else {
				defeat = 1;
			}
			var stats = Estadisticas.find({player_name: Meteor.user().username});
			var statsaux = Estadisticas.findOne({player_name: Meteor.user().username});
			if (stats.count() === 1){
				Estadisticas.update({player_name: Meteor.user().username}, {$set: {game_name: {
					points: statsaux.game_name.points + points, 
					played_games: statsaux.game_name.played_games + 1,
					winned_games: statsaux.game_name.winned_games + victory,
					drawed_games: statsaux.game_name.drawed_games + 0,
					lossed_games: statsaux.game_name.lossed_games + defeat
				}}}
				);        
			}
			else {
				Estadisticas.insert ({
					player_name: Meteor.user().username,
					//De momento Carcassone es el unico juego por defecto
					game_name: {game_name: "Carcassone",
						points: points,
						played_games: 1,
						winned_games: victory,
						drawed_games: 0,
						lossed_games: defeat
					}
				})
			}   
		}
	},
	dameFicha: function(id_partida){
		var partida = getPartida (id_partida);
		var fichaIU;
		var ficha = partida.tablero.dameFicha();
		fichaIU = {
			tipo: ficha.tipo,
			escudo: ficha.escudo,
			numFicha: ficha.numFicha
		};
        return fichaIU;
	},
	ponerFicha: function(id_partida,giro,posFicha){
		console.log("pos que nos dice IU: " + posFicha);
		var success = false;
		var partida = getPartida(id_partida);
		success = partida.tablero.ponerFicha(posFicha,giro);
        return success;
	},
	ponerSeguidor: function(id_partida,posSeguidor,id_usuario){
		var partida = getPartida(id_partida);
		var resumenTurno = partida.tablero.ponerSeguidor (posSeguidor,id_usuario);
		return resumenTurno;
	},
	generarPartidaPL: function(objetoPartidaPL){
		generarPartida(objetoPartidaPL.idPartida, objetoPartidaPL.arrayJugadores, objetoPartidaPL.numJugadores);
	},
	//No se lo que hace esto..pero bueno, de momento aqui se queda
	//Lo dejo porque no borra de la base de datos, sino de una coleccion rara que hay en IA.js 
	finalizarPartida: function(id_partida){ 
		var partida = getPartida(id_partida);
		var objFinal = partida.finalizarPartida();
	return objFinal;
    },
});

//Inicializamos el startup
Meteor.startup(function () {
    //Usuario por defecto, para tener algo en la base de datos si no hay ningun cliente iniciado
    if (Estadisticas.find().count() == 0) {
       Estadisticas.insert({
            player_name: "nullplayer",
            //De momento Carcassone es el unico juego por defecto
            game_name: {game_name: "Carcassone",
                points: 0,
                played_games: 0,
                winned_games: 0,
                drawed_games: 0,
                lossed_games: 0
            }
        });
    };
});



