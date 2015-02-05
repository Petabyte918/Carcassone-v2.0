var sprites = {

    1: { sx: 198, sy: 458, w: 64, h: 64},   //madre
    
    2: { sx:0 , sy: 64, w: 64, h: 64}, 
    
    3: { sx: 918, sy: 264, w: 64, h: 64}, 
    
    4: { sx:722 , sy: 394, w: 64, h: 64},
    
    S5: { sx: 133, sy: 591, w: 64, h: 64}, 
    
    C5: { sx: 263, sy: 524, w: 64, h: 64},   
    
    S6: { sx: 591, sy: 328, w: 64, h: 64}, 
    
    C6: { sx: 657, sy: 526, w: 64, h: 64},  
    
    7: { sx: 918, sy: 198, w: 64, h: 64}, 
        
    8: { sx:722 , sy: 525, w: 64, h: 64},
    
    9: { sx: 788, sy: 66, w: 64, h: 64}, 
    
    S10: { sx: 264, sy: 459, w: 64, h: 64}, 
    
    C10: { sx: 1, sy: 328, w: 64, h:64},    
    
    S11: { sx: 330, sy: 459, w: 64, h: 64}, 
    
    C11: { sx: 330, sy: 0, w: 64, h: 64}, 
    
    S12: { sx: 460, sy: 590, w: 64, h: 64},
        
    C12: { sx: 657, sy: 328, w: 64, h: 64},
    
    13: { sx:723 , sy: 65, w: 64, h: 64}, // De este tipo de pieza solo hay una con escudo.
    
    14: { sx: 0, sy: 0, w: 64, h: 64}, 
    
    15: { sx:918 , sy: 394, w: 64, h: 64}, 
    
    16: { sx:786 , sy: 460, w: 64, h: 64}, 
    
    17: { sx:590 , sy: 590, w: 64, h: 64}, 
    
    18: { sx:526 , sy: 458, w: 64, h: 64}, 
    
    19: { sx:852 , sy: 460, w: 64, h: 64}, 
        
         
    sn:{ sx:989, sy:6, w:17, h:17}, //Seguidor negro
    sa:{ sx:1018, sy:5, w:17, h:17}, //Seguidor amarillo
    sb:{ sx:1049, sy:4, w:17, h:17}, //Seguidor blanco
    sr:{ sx:1077, sy:4, w:17, h:17}, //Seguidor rojo
    sblue:{ sx:1104, sy:4, w:17, h:17}, //Seguidor azul 
};


board = new TableroJuego();
otrapieza = true;
//TextoPidePieza = new TextoPideFicha("Pulsa enter para pedir ficha ",playGame);
piezaactual = "";
cuadriculaS = "";
DejarScroll =false;
//
xIA = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
yIA = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var xprima = 64;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var yprima = 64;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var xIAprima = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var yIAprima = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var scrollxprima = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
var scrollyprima = 0;//estas variables globales son para los calculos de la casilla en la que se pone la ficha para pasarselo a IA
//
JugadoresIA = []    //variable global para cuando IA nos pasa los jugadores
User_IdIA = "";
rotacionTracker = [];
xTracker = 0;
yTracker = 0;
xsegTracker = 0;
ysegTracker = 0;
colocadaTracker = false;
colocadoSegTracker = false;
ladoScrollTracker = "";
contadorScroll = 0;
numcolor = 0;
longitudcolor = 0;
Id_Partida = 0;
arrayRespuestaIA = [];
//BorrarSeguidor = false;
ActualizarTurnoGlobal = false;
IATurno = false;
GestionResumenIA = false;
BorrarSegIA = false;
iGlobal = 0;
NumIAs = 0;
nombreCuadricula = "";
numgiroCuadricula = 0;
giroCuadricula = false;
resumenFinal = [];
finalizarPartida = false;
arrayFinalConstruido = [];
var startGame = function() {
    
    Game.setBoard(0,new cuadricula());
    Game.setBoard(1,new Jugadores(JugadoresIA));       
    //board.add ();
    Game.setBoard(3,new AyudaScreen("Pulsa espacio para ayuda"));
    console.log("Pintada pieza madre");
    board.add(new PiezaMadre("1", 5*64, 5*64)); //Pieza madre que siempre esta puesta cuando empieza el juego
    console.log(Meteor.userId());
    if(Meteor.userId() === User_IdIA){
	    DejarScroll =true;
        Game.setBoard(2,new TextoPideFicha("Pulsa enter para pedir ficha ",playGame));
        //board.add(TextoPidePieza);
    }
    board.add(new ScrollTeclas());
    Game.setBoard(5,board);
   
    
};


playGame = function() {

  if(otrapieza){
	cuadriculaS = new cuadriculaSeguidor();
    pedirPieza();
    console.log("termina Pide Pieza");
    

  }
  
}

function pintaResumen(resumenFinal){

    resumenFinal.forEach(function (e, i) {		
	        //console.log(e);				
	        var stringFinalPartida;
            stringFinalPartida = "Nombre del jugador: " + e.nombre + "  ----------->  " + "Puntos: " + e.puntos;
            arrayFinalConstruido.push(stringFinalPartida);
    });
		    
    Game.setBoard(6,new final(arrayFinalConstruido));
    
    obj = Turno.findOne({});

    Turno.update(obj._id,{$set: {Comando:"FinPartida", resumenFinal: arrayFinalConstruido}}); 
    
    
    board.add(new finalPL(resumenFinal));
    
};

function finalizarPartidaHumano (){

    Meteor.call("finalizarPartida", Id_Partida, function ( error, result) {
            resumenFinal = result;
            console.log("se hace el meteor.call de finalizar partida");
            //console.log(resumenFinal[0]);
            pintaResumen(result);
    });


}

var pedirPieza = function () {

	Meteor.call('dameFicha',Id_Partida, function (error, result) {
	
	    if(!result){
	        console.log("debe acabar la partida");
	        otrapieza = false;
	        finalizarPartidaHumano();
	    
	    }else{
	        var arg;
	        //Esta mal sin terminar porque no sabemos todavia con exactitud que nos va a devolver la IA
	        if((result.tipo === 5) || (result.tipo === 6) || (result.tipo === 10) || (result.tipo === 11) || (result.tipo === 12)){
	        
	            if (result.escudo == true){
	                arg = "C" + result.tipo.toString();
	                console.log(arg);
	            }else{
	                arg = "S" + result.tipo.toString();
	            }
	        
	        }else{
	        
	            arg = result.tipo.toString();
	            
	        }
	        
		
		    var piezaNueva = new pieza (arg, 11.5*64, 8*64, false, 0, false);
		    board.add(piezaNueva);
		    console.log("AÑADIDA PRIMERA PIEZA");
		    //Hacemos update para que los demas clientres pinten la pieza que pide el del turno				
		    obj = Turno.findOne({});
		    //console.log(obj);
		
		    Turno.update(obj._id,{$set: {Comando: "PedirPieza", nombrePieza:arg ,scroll:false}});  
		    console.log("Termina meteor.call");
		
		}
					
	});
	
	
}

var PiezaMadre = function (nombre, x, y){

  this.x = x;
  this.y = y;
  this.w = 64;
  this.h = 64;
  this.nombre = nombre;

 
  this.type = "pieza";

  
  this.step = function(dt) {
  
                  
	
  }
  
  this.draw = function(ctxt) {

	  SpriteSheet.draw(Game.ctxt, nombre, this.x, this.y,this.giro,this.numgiro,1);
  };	

}


Seguidor = function (x, y, color, idx, idy){//añadir color para que se pinte

    this.x = x;
    this.y = y;
    this.type = "pieza";
	this.color = color;            // le dejamos mismo tipo que pieza porque en el draw nos interesa que actue igual en algunas cosas
	this.idx = idx;
	this.idy = idy;
	console.log("PINTADO SEGUIDOR");
	console.log("this.color es = "+ this.color);
    this.step = function(dt) {           

    }
  
    this.draw = function(ctxt) {
        SpriteSheet.draw(Game.ctxt, this.color, this.x, this.y, false, 0, 1);
    };	

}

verColorSeg = function(){
	console.log("numcolor en vercolorseg = "+ numcolor);
	if(numcolor ==0){
		return "sr";
	}else if(numcolor ==1){ 
		return "sblue";
	}else if(numcolor ==2){
		return "sa";
	}else if(numcolor ==3){
		return "sn";
	}else if(numcolor ==4){
		return "sb";
	}
}

pieza = function (nombre, x, y, colocadaRec, giroRec, dejarGiro){
    this.x = x;
    this.y = y;
    this.w = 64;
    this.h = 64;
    this.nombre = nombre;
    var colocada = colocadaRec;
    var noDejan = false;
    this.giro = dejarGiro;
    this.numgiro = giroRec;
    var giroIA = 0;
    this.type = "pieza";
    this.scroll = false;
    this.primeravez = true;
    this.primer = 0;
    
    
    this.step = function(dt) {
    //console.log("colocada = " + colocada);
    if (!colocada){
        otrapieza = false;
         
        if(Meteor.userId() === User_IdIA){
            gameC.onmousedown = function(e){
            if(e.which == 1){
                if (!colocada){//límite(76-644)para la x, (167-674) para la y
                    mX = (e.pageX);
                    mY = (e.pageY);
                    if(mX<373||mX>947 ||mY<433.5 || mY>946){
					    alert('No puedes colocar la pieza ahí!');
			        }else{
				        cX =(Math.floor((mX+18)/64)) - 5;
				        cY = (Math.floor((mY-83)/64)) - 4;						   
				        x = (cX *64);
				        y = (cY * 64);

              			// Para quedarnos con la casilla del tablero donde nos pinchan, para pasarselo a IA.
				        for (i=1;i<9;i++){//
					        xprima = 64;
		           		 	for (j=1;j<10;j++){
						    xIAprima = scrollxprima+xprima/64;
						    yIAprima = scrollyprima+yprima/64;
						    xprima += 64;
					      	if(cX == j && cY == i){
							    xIA = xIAprima;
							    yIA = yIAprima;
							    console.log("giroIA = " + giroIA);
							    console.log("xIA = " + xIA);
							    console.log("yIA = " + yIA);
						    }
					    }
					    yprima += 64;
				       }//
				       
				       Meteor.call("ponerFicha",Id_Partida,giroIA,{x: xIA,y: yIA}, function (error, result) {
				      	if(result){
				      	    noDejan = false;
						    obj = Turno.findOne({Comando:"PedirPieza"});
						    Turno.update(obj._id,{$set: {Comando:"ColocarPieza",posx: x, posy:y, casillaX: xIA, casillaY: yIA, scroll:false }});
							globalPiezaActualFallo = piezaactual;
							nombreCuadricula = nombre;
							console.log(" nombreCuadricula =" + nombreCuadricula);
							numgiroCuadricula = giroIA;
							console.log(" numgiroCuadricula =" + numgiroCuadricula);
							console.log(" giroCuadricula =" + giroCuadricula);
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
						    board.add(piezaactual);
						    board.add(cuadriculaS);
							console.log("añadido cuadriculaS y piezaActual"); 
						    DejarScroll = false;    //cuando estamos esperando a que pulsen una tecla para elegir la posicion donde colocar el seguidor se mete dibujo para colocar seguidor no se puede mover el scroll
						    board.add(new ColocarSeguidor(x, y, xIA, yIA)); 
						    colocada = true;	
					    }else{
						    noDejan = true;
						    alert('No puedes colocar la pieza ahí!');
					    }
				       });
				       xIAprima = 0;
				       yIAprima = 0;
				       xprima = 64;
				       yprima = 64;
				
			       }
		      }
		         
           }
        }   
        //else{miramos la variable global y con esos datos modificamos x e y del objeto pieza y ponemos colocada a true y la variable global la 
        //ponemos a false     
              
	    if(Game.keys['giro']){
		
			    this.giro = true;
				giroCuadricula = true;
			    this.numgiro++;
			    giroIA++;
			    if(this.numgiro == 4){
				    this.numgiro = 0;
				    giroIA = 0;
			    }
			    console.log("this.numgiro = " +this.numgiro)
			    
			    obj = Turno.findOne({Comando: "PedirPieza"});
			    
			    Turno.update(obj._id, {$set: {rotacion: true, numRotacion: this.numgiro,scroll:false}});
			    Game.keys['giro'] = false;
	    }
	    	
    }else{
    
        if(rotacionTracker[0]){
            this.giro = true;
            this.numgiro = rotacionTracker[1];
            rotacionTracker[0] = false;
        }else if(colocadaTracker){//si ya no es mi turno, mirar colocadaTracker si esta a true o a false
		    x = xTracker;
		    y = yTracker;
		    board.add(new ColocarSeguidor(x, y, xIA, yIA))
		    colocada = true;
		    colocadaTracker = false;
	    }
    }
    }
  };
  
  this.draw = function(ctxt) {
		  if(colocada && !this.scroll){
			//console.log("como esta colocada cambio el this.x");
			this.x = x;
			this.y = y;
			this.primeravez = false;
			this.primer= 1; //si la colocamos ya no es la primeravez que sale a imagen,lo hago para que si es aun la pieza a 
			this.scroll = true;//colocar pues se pueda pintar fuera de la cuadricula, es decir, si this.primer = 0
					//(ver draw de spritesheet engine)
			console.log("IA_TURNO: " + IATurno);
			 if((Meteor.userId() === User_IdIA) && (!IATurno)){
				alert("Si NO quieres poner seguidor pulsa N.") ; 
			}else if((Meteor.userId() === User_IdIA) && (IATurno)){
			   // alert("Turno de IA") ; 
			}
		  }
		  if(!this.scroll){//esto es para que si aun la pieza es la que tenemos que colocar al hacer scroll no se mueva
			this.x = x;//si scroll esta a false, la pieza mantiene las coordenadas (11.5*64, 8*64)
			this.y = y;
		  }

		  if(noDejan){
			this.x = 11.5*64;
			this.y = 8*64;
		  	
		  }
	 
	  SpriteSheet.draw(Game.ctxt, nombre, this.x, this.y,this.giro,this.numgiro,this.primer);

  };
}


//constructor para inicializar jugadores y pintarlos a un lado....etc
//de momento sin argumentos porque por defecto suponemos los 4 jugadores inicializados al principio
//supongo que luego como argumentos habrá que pasarle los jugadores que nos informen que juagan
Jugadores = function(arrayJugadores){
	colores = ["sr", "sblue", "sa", "sn", "sb"];
    this.step = function(dt) {
        //De momento lo pongo vacio porque solo quiero probar tittle scream
    };
    this.draw = function(ctxt) {
  
        ctxt.fillStyle = "#FFFFFF";
        ctxt.font = "bold 27px bangers";
        ctxt.fillText("JUGADORES", 10.5*64,1.5*64);
        arrayJugadores.forEach(function (e, i) {
        ctxt.font = "bold 17px bangers";
        ctxt.fillStyle = "#FFFFFF";
        ctxt.fillText(e.nombre, 10.5*64,(2+i)*64);
        SpriteSheet.draw(Game.ctxt, colores[i], 12.5*64, (1.75+i)*64,false,0,0);
        ctxt.font = "bold 14px bangers";
        ctxt.fillStyle = "#FFFFFF";
        ctxt.fillText("puntos", 10.7*64, (2.3+i)*64);
        ctxt.fillStyle = "#FF0000";
        ctxt.fillText(e.puntos, 11.6*64, (2.3+i)*64);
        ctxt.fillStyle = "#FFFFFF";
        ctxt.fillText("seguidores", 12.3*64, (2.3+i)*64);
        ctxt.fillStyle = "#FF0000";
        ctxt.fillText(e.numSeguidores, 13.7*64, (2.3+i)*64);
        });
		
    };
}

var cuadricula = function(){
    this.step = function(dt) {
        
    };
    this.draw = function(ctxt) {
      //Pantalla que va a aparecer DESPUES de pulsar espacio
      var img1 = new Image();
      var img2 = new Image();
      img1.src = 'background.jpg';
      img2.src = 'menu.jpg';
      Game.ctxt.drawImage(img1, 50, 50, 655, 650);
      Game.ctxt.drawImage(img2, 655, 50, 245, 650);
	    for (i=1;i<9;i++){
        for (j=1;j<10;j++){
          Game.ctxt.strokeStyle = "#ffffff";
          Game.ctxt.strokeRect(j*64,i*64,64,64);
        }
      }
    };	
}

final = function(array){
    this.step = function(dt) {
      
    };
    this.draw = function(ctxt) {
 
        var img1 = new Image();
        var img2 = new Image();
        img1.src = 'background.jpg';
        Game.ctxt.drawImage(img1, 50, 50, 900, 650);
      
        ctxt.save();
        var b = 2.6;
        ctxt.fillStyle = '#9C1B14';
        ctxt.fillRect(120,90,520,420);
        ctxt.strokeStyle="black";
        ctxt.strokeRect(120,90,520,420);
        for (i = 0; i<array.length; i++){
            ctxt.font = "bold 18pt sans-serif";
            ctxt.fillText("RESUMEN FINAL DE LA PARTIDA :", 2.1 *64,1.8*64 ) ;
            ctxt.font = "10pt sans-serif";
            ctxt.fillStyle = "black";
            ctxt.fillText("(Pulsa f si quieres terminar la partida)", 2.1 * 64, 2.1 * 64) ;
            ctxt.fillStyle = "black";
            ctxt.font = "italic bold 15pt courier" ;
            ctxt.strokeStyle="black";
            ctxt.fillText(array[i],2.1*64,b*64,300);         
            b = b+1;
        }
        ctxt.restore();
    };  
}

var ColocarSeguidor = function(x, y, idx, idy) {
    posicion0 = false;
    posicion1 = false;
    posicion2 = false;
    posicion3 = false;
    posicion4 = false;
    posicion5 = false;
    posicion6 = false;
    posicion7 = false;
    posicion8 = false;
    posicion9 = false;
    posicion10 = false;
    posicion11 = false;
    posicion12 = false;
    noseg = false;
    var colocado = false;
    var ActualizarTurno = true;
    var BorrarSeguidor = false;
	var colorSeg = "";
	var GestionResumenIAlocal = true;
	var BorrarSegIAlocal = true;
	var finalizarPartidalocal = true;

    this.step = function(dt) {
    
        if(!colocado){ 
	        if(Meteor.userId() === User_IdIA){     
		        if(Game.keys['pos0']) posicion0 = true;
	            if(posicion0 && !Game.keys['pos0']) {                   
	                posicion0 = false;
	                board.remove(piezaactual);  
	                board.remove(cuadriculaS);
	                Meteor.call("ponerSeguidor", Id_Partida, 0, User_IdIA, function ( error, result) {
	                    if(result[0]){
							colorSeg = verColorSeg();                            
	                        board.add (new Seguidor (x+7.5, y+2.5,colorSeg, idx, idy)); 
	                        
		                    obj = Turno.findOne({Comando:"ColocarPieza"});		                    
		                    Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+7.5, posyseg:y+2.5,scroll:false}});
		                    
		                    colocado= true;
			                Game.setBoard(2,new CapaBorra());    
		                    DejarScroll = false;	  
                            arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			                
                        }else{
		                    alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
		                    board.add(piezaactual);
				            board.add(cuadriculaS); 
		                }

                    });
                }		
		        if(Game.keys['pos1']) posicion1 = true;
		        if(posicion1 && !Game.keys['pos1']) {
		            posicion1 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 1, User_IdIA, function ( error, result) {
		                if(result[0]){	
							colorSeg = verColorSeg();                                      
		                    board.add (new Seguidor (x+22, y+2.5,colorSeg, idx, idy)); 
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+22, posyseg:y+2.5,scroll:false}});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());     
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
					        board.add(cuadriculaS); 
			            }
		            });
		        }
		        if(Game.keys['pos2']) posicion2 = true;
		        if(posicion2 && !Game.keys['pos2']) {
		            posicion2 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 2, User_IdIA, function ( error, result) {
		                if(result[0]){
							colorSeg = verColorSeg();                                      
		                    board.add (new Seguidor (x+41, y+2.5,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor", posxseg: x+41, posyseg:y+2.5,scroll:false}});
			                colocado= true;        
				            Game.setBoard(2,new CapaBorra());  
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }
		            });
		        
		        }
		        if(Game.keys['pos3']) posicion3 = true;
		        if(posicion3 && !Game.keys['pos3']) {
		            posicion3 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);  
		            Meteor.call("ponerSeguidor", Id_Partida, 3, User_IdIA, function ( error, result) {
		        
		                if(result[0]){
							colorSeg = verColorSeg();                                      
		                    board.add (new Seguidor (x+48, y+14.5,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+48, posyseg:y+14.5,scroll:false }}); 
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());     
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }
			        });       
		                   
		        }
		        if(Game.keys['pos4']) posicion4 = true;
		        if(posicion4 && !Game.keys['pos4']) {
		            posicion4 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 4, User_IdIA, function ( error, result) {
		                if(result[0]){
							colorSeg = verColorSeg();                                      
		                    board.add (new Seguidor (x+48, y+27,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+48, posyseg:y+27,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());    
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
					        board.add(cuadriculaS); 
			            }
		            });       
		        }
		        if(Game.keys['pos5']) posicion5 = true;
		        if(posicion5 && !Game.keys['pos5']) {
		            posicion5 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 5, User_IdIA, function ( error, result) {
		                if(result[0]){  
							colorSeg = verColorSeg();                                   
		                    board.add (new Seguidor (x+48, y+39,colorSeg, idx, idy));
                            
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+48, posyseg:y+39,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());     
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });       	                       
		        }
		        if(Game.keys['pos6']) posicion6 = true;
		        if(posicion6 && !Game.keys['pos6']) {
		            posicion6 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 6, User_IdIA, function ( error, result) {
		                if(result[0]){
						    colorSeg = verColorSeg();                                     
		                    board.add (new Seguidor (x+40, y+48,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+40, posyseg:y+48,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());    
		                    DejarScroll = false;
				            arrayRespuestaIA = result[1];
		                    BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });    
		        }
		        if(Game.keys['pos7']) posicion7 = true;
		        if(posicion7 && !Game.keys['pos7']) {
		           posicion7 = false;
		           board.remove(piezaactual);  
		           board.remove(cuadriculaS);
		           Meteor.call("ponerSeguidor", Id_Partida, 7, User_IdIA, function ( error, result) {
		                if(result[0]){
							colorSeg = verColorSeg();                                       
		                    board.add (new Seguidor (x+22, y+48,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+22, posyseg:y+48,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());     
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });    
		        }
		        if(Game.keys['pos8']) posicion8 = true;
		        if(posicion8 && !Game.keys['pos8']) {
		            posicion8 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 8, User_IdIA, function ( error, result) {
		                if(result[0]){
							colorSeg = verColorSeg();                              
		                    board.add (new Seguidor (x+7.5, y+48,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+7.5, posyseg:y+48,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());    
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });    
		        }
		        if(Game.keys['pos9']) posicion9 = true;
		        if(posicion9 && !Game.keys['pos9']) {
		            posicion9 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 9, User_IdIA, function ( error, result) {
		                if(result[0]){ 
							colorSeg = verColorSeg();                                    
		                    board.add (new Seguidor (x, y+39,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x, posyseg:y+39,scroll:false }});
			                colocado= true;       
				            Game.setBoard(2,new CapaBorra());    
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });    
		        }
		        if(Game.keys['pos10']) posicion10 = true;
		        if(posicion10 && !Game.keys['pos10']) {
		            posicion10 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 10, User_IdIA, function ( error, result) {
		                if(result[0]){ 
							colorSeg = verColorSeg();                                    
		                    board.add (new Seguidor (x, y+27,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x, posyseg:y+27,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());     
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });          
		        }
		        if(Game.keys['pos11']) posicion11 = true;
		        if(posicion11 && !Game.keys['pos11']) {
		            posicion11 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 11, User_IdIA, function ( error, result) {
		               if(result[0]){
							colorSeg = verColorSeg();                                     
		                    board.add (new Seguidor (x, y+14.5,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x, posyseg:y+14.5 ,scroll:false}});
			                colocado= true;       
				            Game.setBoard(2,new CapaBorra());   
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{
			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
						    board.add(cuadriculaS); 
			            }	        
		            });          
		        }
		        if(Game.keys['pos12']) posicion12 = true;
		        if(posicion12 && !Game.keys['pos12']) {
		            posicion12 = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, 12, User_IdIA, function ( error, result) {
		                if(result[0]){
							colorSeg = verColorSeg();                                     
		                    board.add (new Seguidor (x+24, y+27,colorSeg, idx, idy));
			                obj = Turno.findOne({Comando:"ColocarPieza"});
			                Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: x+24, posyseg:y+27,scroll:false }});
			                colocado= true;      
				            Game.setBoard(2,new CapaBorra());    
			                DejarScroll = false;
					        arrayRespuestaIA = result[1];
			                BorrarSeguidor = true;
			            }else{

			                alert("No puedes colocar un seguidor en esa posicion \nPrueba otra");
							piezaactual = new PiezaActual(nombreCuadricula,numgiroCuadricula,giroCuadricula);
							cuadriculaS = new cuadriculaSeguidor();
			                board.add(piezaactual);
				            board.add(cuadriculaS); 
			            }	        
		            });            
		        }
		        if(Game.keys['NOSeguidor']) noseg = true;
		        if(noseg && !Game.keys['NOSeguidor']) {
		            noseg = false;
		            board.remove(piezaactual);  
		            board.remove(cuadriculaS);
		            Meteor.call("ponerSeguidor", Id_Partida, function ( error, result) {
			            obj = Turno.findOne({Comando:"ColocarPieza"});
			            Turno.update(obj._id,{$set: {Comando:"ColocarSeguidor",posxseg: 0, posyseg:0,scroll:false }});
			            colocado= true;
			            Game.setBoard(2,new CapaBorra());
			            DejarScroll = false;
                        arrayRespuestaIA = result[1];
		                BorrarSeguidor = true;   
		            });
                }             
		    }else{
			    if(colocadoSegTracker){
				    if(xsegTracker != 0 && ysegTracker != 0){
						colorSeg = verColorSeg();
					    board.add (new Seguidor (xsegTracker, ysegTracker,colorSeg, idx, idy));
					   
					    colocado= true;
					    colocadoSegTracker = false;
				    }else{
					    colocado= true;
					    colocadoSegTracker = false;
				    }
		        }
	        }
        }else if(BorrarSeguidor){
            BorrarSeguidor = false;
            gestionCambiarTurno(arrayRespuestaIA);
            
			
	        
	        
        }else if(ActualizarTurnoGlobal && ActualizarTurno){
            ActualizarTurno = false;
            ActualizarTurnoGlobal = false;
            numcolor++;
            if(numcolor == longitudcolor){
                
                numcolor = 0;
            }
            //console.log("longitudcolor al actualizar es = " + longitudcolor);
            //console.log("numcolor al actualizar es = " + numcolor);
            
            if (!arrayRespuestaIA[iGlobal].idSiguienteJug){
            
                Meteor.call("finalizarPartida", Id_Partida, function ( error, result) {
                    resumenFinal = result;
                    console.log("se hace el meteor.call de finalizar partida");
                    finalizarPartida = true;
                });
                
            
            }else{
            
                obj = Turno.findOne({Comando:"BorrarSeguidor"});

                Turno.update(obj._id,{$set: {Comando:"ActualizarTurno", ID_Partida: Id_Partida, Jugadores: arrayRespuestaIA[iGlobal].arrayResumenJugs, User_id: arrayRespuestaIA[iGlobal].idSiguienteJug, nombrePieza: "", rotacion: false, numRotacion: 0, casillaX: 0, casillaY: 0, arrayQuitarSeg: [], posx: 0, posy: 0, posxseg: 0, posyseg:0, scroll: false, ladoscroll: "", contador: 0, numColor: numcolor}}); 
            
            }
            
        
        }else if(GestionResumenIA && GestionResumenIAlocal){
            GestionResumenIA = false;
            GestionResumenIAlocal = false;
            console.log("antes de entrar a gestionar el turno de ia ");
            gestionTurnoIA(arrayRespuestaIA);
   
        }else if(BorrarSegIA && BorrarSegIAlocal){
			BorrarSegIA = false;
		    console.log("iglobal antes de borrar ias es = "+iGlobal);
		    console.log("arrayRespuestaIA[iGlobal]  es = " + arrayRespuestaIA[iGlobal]);
			gestionBorrarSeguidor(arrayRespuestaIA[iGlobal]);
			
		    if (numIAs === iGlobal){
			    BorrarSegIAlocal = false;
			    console.log("ULTIMA IA");
			    setTimeout(function(){
 					ActualizarTurnoGlobal = true;
        		},1000);
                
			}			
		}else if(finalizarPartida && finalizarPartidalocal){
	        finalizarPartida = false;
	        finalizarPartidalocal = false;
		    
		    resumenFinal.forEach(function (e, i) {		
		        console.log(e);				
		        var stringFinalPartida;
                stringFinalPartida = "Nombre del jugador: " + e.nombre + "  ----------->  " + "Puntos: " + e.puntos;
                arrayFinalConstruido.push(stringFinalPartida);
	        });
		    
		    Game.setBoard(6,new final(arrayFinalConstruido));
	        
	        obj = Turno.findOne({});

            Turno.update(obj._id,{$set: {Comando:"FinPartida", resumenFinal: arrayFinalConstruido}}); 
            
            board.add(new finalPL(resumenFinal));
		    
		
		}
    }   
    this.draw = function(ctxt) {
        
    }
}


var ScrollTeclas = function() {

    this.width = 140;
    this.height = 140;
    this.scrollx = 45;
    this.scrolly = 45;

    var izq = false;
    var der = false;
    var arriba = false;
    var abajo = false;


    this.draw = function (ctxt) {
        ctxt.save();
        for(var y=0; y<=550; y=y+64){
            for(var x=0; x<=600; x=x+64){
                ctxt.fillText((this.scrollx+x/64) + ".",7+x,11+y);
                ctxt.fillText((this.scrolly+y/64),32+x,11+y);
            };
        };

        ctxt.restore();
    }
    
    this.step = function(dt) {
    
        if (DejarScroll){
    		if(Meteor.userId() === User_IdIA){
			if(!Game.keys['left']) izq = true;
			if(izq && Game.keys['left']) {
			    izq = false;
			    if (this.scrollx != 0) {
				this.scrollx -= 1;
				this.board.translateScroll(1,0);
			    }
			//ScrollTracker = true;
			contadorScroll++;
			obj = Turno.findOne({});
			Turno.update(obj._id,{$set: {scroll:true,ladoscroll:"izq",contador: contadorScroll}});
			    
			}
		
			if(!Game.keys['right']) der = true;
			if(der && Game.keys['right']) {
			    der = false;
			    if (this.scrollx < 91) {
				this.scrollx += 1;
				this.board.translateScroll(-1,0);

			    }
			   //ScrollTracker = true;
			   contadorScroll++;
			   obj = Turno.findOne({});
			   Turno.update(obj._id,{$set: {scroll:true,ladoscroll:"der",contador: contadorScroll }});
			}
		
			if(!Game.keys['up']) arriba = true;
			if(arriba && Game.keys['up']) {
			    arriba = false;
			    if (this.scrolly != 0) {
				this.scrolly -= 1;
				this.board.translateScroll(0,1);

			    }
			   //ScrollTracker = true;
			   contadorScroll++;
			   obj = Turno.findOne({});
			   Turno.update(obj._id,{$set: {scroll:true,ladoscroll:"up",contador: contadorScroll }});
			}
		
			if(!Game.keys['down']) abajo = true;
			if(abajo && Game.keys['down']) {
			    abajo= false;
			    if (this.scrolly < 92) {
				this.scrolly += 1;
				this.board.translateScroll(0,-1);
			    }
			  //ScrollTracker = true;
			  contadorScroll++;
		    	  obj = Turno.findOne({});
			  Turno.update(obj._id,{$set: {scroll:true,ladoscroll:"down",contador: contadorScroll }});
			}
		
			    scrollxprima = this.scrollx;
		   	    scrollyprima = this.scrolly;
		}else{
			if(ladoScrollTracker == "izq"){
				
				if (this.scrollx != 0) {
					this.scrollx -= 1;
					this.board.translateScroll(1,0);
			   	}
				//ScrollTracker = false;
			}else if(ladoScrollTracker == "der"){
				
				if (this.scrollx < 91) {
					this.scrollx += 1;
					this.board.translateScroll(-1,0);
			   	}
				//ScrollTracker = false;
			}else if(ladoScrollTracker == "up"){
				
				if (this.scrolly != 0) {
					this.scrolly -= 1;
					this.board.translateScroll(0,1);
			    	}
				//ScrollTracker = false;
			}else if(ladoScrollTracker == "down"){
				
				if (this.scrolly < 92) {
					this.scrolly += 1 ;
					this.board.translateScroll(0,-1);
				}
				//ScrollTracker = false;
			}
			scrollxprima = this.scrollx;
		   	scrollyprima = this.scrolly;
			DejarScroll = false;
		}
	}	   
   	   
    }

}


function gestionBorrarSeguidor (result){
        console.log("ENTRA A GESTION BORRAR SEGUIDOR");
        console.log("result.arraySeguidoresQuitar es = "+ result.arraySeguidoresQuitar);
        var seg = result.arraySeguidoresQuitar;
        //if(seg!=undefined){
        	seg.forEach(function (e, i) { 
        	console.log("entra a seg.foreach");           
            borrarSeguidor(e.x, e.y);
        	});
        //}
        
        
        
        obj = Turno.findOne({});
        Turno.update(obj._id,{$set: {Comando:"BorrarSeguidor", arrayQuitarSeg: result.arraySeguidoresQuitar, scroll:false }});
  
};

function gestionCambiarTurno(result){
    
    iGlobal = 0;   
    if (result.length > 1){
        
        //hay jugador IA
        //Primero tenemos que hacer el resumen del jugador humano, borrar
        console.log("METEEEE");
        setTimeout(function(){
	        gestionBorrarSeguidor(result[0]);
	        GestionResumenIA = true;
    	},500);
       
        //IATurno = false;        //Importante pñoner esto a false en algun momento
    }else{
        //El siguiente es humano
        
        //Primero borramos seguidores
        
        gestionBorrarSeguidor(result[0]);
        ActualizarTurnoGlobal = true;

    }
    
}

function gestionTurnoIA (result){
 //ActualizarTurnoGlobal = true;
        
        var tamañoArray = result.length;
        numIAs = tamañoArray - 1;
        
        if(result[1] != undefined){
        	setTimeout(function(){
        	console.log("entra a 1");
        	iGlobal = 1;
        	IATurno = true;
        	numcolor++;
        	pintarInfoIA(result[1]);
        	},2000);
        }
        if(result[2] != undefined){
        	setTimeout(function(){
        	console.log("entra a 2");
        	iGlobal = 2;
        	IATurno = true;
        	numcolor++;
        	pintarInfoIA(result[2]);
        	},4000);
        	
        }
        if(result[3] != undefined){
        	setTimeout(function(){
        	console.log("entra a 3");
        	iGlobal = 3;
        	IATurno = true;
        	numcolor++;
        	pintarInfoIA(result[3]);
        	},6000);
        	
        }
        if(result[4] != undefined){
        	setTimeout(function(){
        	console.log("entra a 4");
        	iGlobal = 4;
        	IATurno = true;
        	numcolor++;
        	pintarInfoIA(result[4]);
        	},8000);
        	
        }
        setTimeout(function(){
        	IATurno = false;
        },10000);
}

function pintarInfoIA (ObjetoIA){
    
    var arg;
    
    info = ObjetoIA.fichaPuesta;
    if (!info){
        console.log("termina partida IA todo null");
        finalizarPartidaHumano();
    }else{
        var tipoPieza = info[0].tipo;
        var escudo = info[0].escudo;
        var giroRec = info[0].giro;
        console.log("GIROOOOOOO: " + giroRec);
        
        if((tipoPieza === 5) || (tipoPieza === 6) || (tipoPieza === 10) || (tipoPieza === 11) || (tipoPieza === 12)){
	        
	            if (escudo === true){
	                arg = "C" + tipoPieza.toString();
	                console.log(arg);
	            }else{
	                arg = "S" + tipoPieza.toString();
	            }
	        
	        }else{
	        
	            arg = tipoPieza.toString();
	            
        }
        
        var xRec = info[1].x;
        var yRec = info[1].y;
        console.log("posicion donde colocar la xIA: " + xRec);
        console.log("posicion donde colocar la yIA: " + yRec);
        
        //calculamos la posicion del canvas con la casilla del tablero que nos pasan
        var posTableroX = xRec - scrollxprima;
        var posTableroY = yRec - scrollyprima;
        var posCanvasX = (posTableroX * 64);
        var posCanvasY = (posTableroY * 64);
        
        //Añadimos la pieza de IA
        var piezaNueva = new pieza (arg, posCanvasX, posCanvasY, true, giroRec, true);
	    board.add(piezaNueva);
	
	    //Calculamos la posicion del seguidor para pintarlo correctamente
	    var posSeg = info[2];
        
        switch (posSeg)
        {
            case 0: 
                board.add (new Seguidor (posCanvasX+7.5, posCanvasY+2.5,verColorSeg(), xRec, yRec));
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+7.5, posyseg:posCanvasY+2.5, numRotacion: giroRec, numColor: numcolor, scroll:false }}); 
                break;
            case 1:
                board.add (new Seguidor (posCanvasX+22, posCanvasY+2.5,verColorSeg(), xRec, yRec));
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+22, posyseg:posCanvasY+2.5, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 2:
                board.add (new Seguidor (posCanvasX+41, posCanvasY+2.5,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+41, posyseg:posCanvasY+2.5, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 3:
                board.add (new Seguidor (posCanvasX+48, posCanvasY+14.5,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+48, posyseg:posCanvasY+14.5, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 4:
                board.add (new Seguidor (posCanvasX+48, posCanvasY+27,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+48, posyseg:posCanvasY+27, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 5:
                board.add (new Seguidor (posCanvasX+48, posCanvasY+39,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+48, posyseg:posCanvasY+39, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 6:
                board.add (new Seguidor (posCanvasX+40, posCanvasY+48,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+40, posyseg:posCanvasY+48, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 7:
            	console.log("verColorSeg() = " +verColorSeg());
                board.add (new Seguidor (posCanvasX+22, posCanvasY+48,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+22, posyseg:posCanvasY+48, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 8:
                board.add (new Seguidor (posCanvasX+7.5, posCanvasY+48,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+7.5, posyseg:posCanvasY+48, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 9:
                board.add (new Seguidor (posCanvasX, posCanvasY+39,verColorSeg(), xRec, yRec));
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX, posyseg:posCanvasY+39, numRotacion: giroRec, numColor: numcolor, scroll:false }});   
                break;
            case 10:
                board.add (new Seguidor (posCanvasX, posCanvasY+27,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX, posyseg:posCanvasY+27, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            case 11:
                board.add (new Seguidor (posCanvasX, posCanvasY+14.5,verColorSeg(), xRec, yRec));
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX, posyseg:posCanvasY+14.5, numRotacion: giroRec, numColor: numcolor, scroll:false }});   
                break;
            case 12:
                board.add (new Seguidor (posCanvasX+24, posCanvasY+27,verColorSeg(), xRec, yRec)); 
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: posCanvasX+24, posyseg:posCanvasY+27, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            default:
                obj = Turno.findOne({Comando:"BorrarSeguidor"});
                Turno.update(obj._id,{$set: {Comando:"JugadaIA", nombrePieza: arg, posx: posCanvasX, posy: posCanvasY, casillaX: xRec, casillaY: yRec, posxseg: 0, posyseg:0, numRotacion: giroRec, numColor: numcolor, scroll:false }});  
                break;
            
        }
        
        BorrarSegIA = true;
	}
};




borrarSeguidor = function (idx, idy){

    board.borrarSeguidor(idx,idy);

};


finalPL = function(array) {

    var fin = false;
    this.step = function (dt) {
 
        if(!Game.keys['fin']) fin = true;
        if(fin && Game.keys['fin']) {
            fin = false;
            var arrayJugs = [];
            var partida = {};
            console.log("IDDDDDDDDDDDDDDD" + Id_Partida);
            partida.idPartida = Id_Partida;
            
             for(i = 0; i< array.length; i++ ){
                var obj = {};
                obj.nombreJugador = array[i].nombre;
                obj.puntuacion = array[i].puntos;
                arrayJugs.push(obj);
                console.log(arrayJugs[i].nombreJugador);
             }
             
            partida.arrayJugadores = arrayJugs;

            partidaTerminada(partida);
            
            obj = Turno.findOne({});
        	Turno.update(obj._id,{$set: {Comando:"FinPL", objetoPL: partida, scroll:false }});
                        
        }
    };

    this.draw = function(ctxt) {
    
    };

};

EmpezarTodo = function (id_partida, arrayJugadores, user_Id) {

       
    Game.initialize("gameC",sprites,startGame);
     
    JugadoresIA = arrayJugadores;
    User_IdIA = user_Id;
    Id_Partida = id_partida;
    console.log("ID_PARTIDA_RECIBIDO: " + Id_Partida);
    longitudcolor = arrayJugadores.length;
    
    //ctxt.restore();
};
/*
EmpezarTodo = function (arrayJugadores) {
    console.log("empezando");
    //Game.initialize("game",sprites,startGame);
};

*/
