empezarPartida = function(id_partida, arrayJug, user_Id) {
	console.log("FUNCIONA14. IU.js. Dentro de empezar partida. Aqui viene otro monton de trazas de quien ha programado esto. Las dejamos");
	console.log("IU: NOS LLEGA LA LLAMADA DE IA DE EMPEZARPARTIDA");
    
	arrayJug.forEach(function (e, i) {
		console.log("JUGADORES: " + e.nombre);
		console.log("Puntos: " + e.puntos);
		console.log("seguirodes: " + e.seguidores);
	});
    
	console.log("user_ID: " + user_Id); 
    
    Turno.remove({});
    Turno.insert({Comando: "EmpezarPartida",
                  ID_Partida: id_partida,
                  Jugadores: arrayJug,
                  User_id: user_Id,
                  nombrePieza: "",
                  rotacion: false,
                  numRotacion: 0,
                  casillaX: 0,
                  casillaY: 0,
                  arrayQuitarSeg: [],
  		  posx: 0,
	          posy: 0,
	          posxseg: 0,
	          posyseg:0,
	          scroll: false,
	          ladoscroll: "",
	          contador: 0,
	          numColor: 0,
	          resumenFinal : [],
	          objetoPL : {}});
                  
	console.log("FUNCIONA15. IU.js. Dentro de empezar partida. Acabamos de insertar en Turno todo a 0 y el EmpezarPartida");
	console.log("FUNCIONA16. IU.js. Dentro de empezar partida. Suponemos que el insertar en turno EmpezarPartida esta bien");
}
