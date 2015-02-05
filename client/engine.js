Game = new function() {                                                                  

  // Inicializa el juego
  this.initialize = function(canvasElementId,sprite_data,callback) {
	  this.canvas = document.getElementById(canvasElementId);
	  console.log("ALVARO " + canvasElementId);
	  this.width = this.canvas.width;
	  this.height= this.canvas.height;
	  this.ctxt = this.canvas.getContext && this.canvas.getContext('2d');
	  if(!this.ctxt) { return alert("Please upgrade your browser to play"); }
	  //this.ctxt.save();
      //Modificamos las propiedades del canvas
      //Pantalla que va a aparecer ANTES de pulsar espacio (En el caso de que se necesite)
      this.setupInput();
    
      this.loop(); 

	    SpriteSheet.load (sprite_data,callback);
    };
    
    
    // Gestión de la entrada (teclas solo espacio de momento para prueba tonta)
    var KEY_CODES = { 32 :'espacio', 82: 'giro', 13: 'pedirficha', 39:'right', 37:'left', 38:'up', 40:'down',83 : 'seguidor', 
                      48: 'pos0', 49: 'pos1', 50: 'pos2', 51: 'pos3', 52: 'pos4', 53: 'pos5', 54: 'pos6', 55: 'pos7', 56: 'pos8',
                      57: 'pos9', 81: 'pos10', 87: 'pos11', 69: 'pos12', 78: 'NOSeguidor', 70: 'fin'};
    this.keys = {};

    this.setupInput = function() {
	    $(window).keydown(function(event){
	      if (KEY_CODES[event.which]) {
		      Game.keys[KEY_CODES[event.which]] = true;
		      return false;
	      }
	    });
	
	    $(window).keyup(function(event){
	      if (KEY_CODES[event.which]) {
		      Game.keys[KEY_CODES[event.which]] = false;
		      return false;
	      }
	    });
	  }
    
    //Añado aqui el bucle del juego al principio tal cual copiado del alien invasion para probar el tittle screen.
    // Bucle del juego
    var boards = [];
    this.loop = function() { 
	    // segundos transcurridos
	    var dt = 100 / 1000;

	    // Para cada board, de 0 en adelante, se 
	    // llama a su método step() y luego a draw()
	    for(var i=0,len = boards.length;i<len;i++) {
	      if(boards[i]) { 
		      boards[i].step(dt);
		      boards[i].draw(Game.ctxt);
	      }
	    }
      // Ejecutar dentro de 30 ms
           
	         setTimeout(Game.loop,100);
	  
    };
    // Para cambiar el panel activo en el juego.
    // Son capas: se dibujan de menor num a mayor
    // Cada capa tiene que tener en su interfaz step() y draw()
    this.setBoard = function(num,board) { boards[num] = board; };
    
};

SpriteSheet = new function() {

  this.map = { };
  
  this.load = function(spriteData,callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'sprites.jpg';
  };

  this.draw = function(ctxt,sprite,x,y,girar,numgiro,primeravez,seguidor) {
    var s = this.map[sprite];
    
    if(girar){
	    ctxt.save();	    
	    ctxt.translate(x,y);
	    ctxt.translate(s.w/2, s.h/2);
	     
	    if(numgiro == 1){
		    //console.log("entro a rotar 90");		    
		    ctxt.rotate(90*Math.PI/180);
		    if((x>=64 && x<=576) && (y<=512 && y>=64) && primeravez == 1){
		   	 ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
		    }else if (primeravez == 0){
			if (seguidor){
			ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h,Math.floor(-s.w/2) , Math.floor(-s.h/2)-64*2,3*s.w, 3*s.h);
			}else{
			ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
			}
		    }
	    }else if (numgiro == 2){
		    //console.log("entro a rotar 180");
		    ctxt.rotate(180*Math.PI/180);
		    if((x>=64 && x<=576) && (y<=512 && y>=64) && primeravez == 1){
		    	ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
		    }else if (primeravez == 0){
			if (seguidor){
			 ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h,Math.floor(-s.w/2)-2*64 , Math.floor(-s.h/2)-64*2,3*s.w, 3*s.h);
			}else{
			 ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
			}
		    }
	    }else if (numgiro == 3){
		    //console.log("entro a rotar 270");
		    ctxt.rotate(270*Math.PI/180);
		    if((x>=64 && x<=576) && (y<=512 && y>=64) && primeravez == 1){
		    	ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
		     }else if (primeravez == 0){
			if (seguidor){
			  ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h,Math.floor(-s.w/2)-2*64 , Math.floor(-s.h/2),3*s.w, 3*s.h);
			}else{
			  ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
			}
		    }
	    }else if(numgiro == 00){//Vuelve al estado normal
		if((x>=64 && x<=576) && (y<=512 && y>=64) && primeravez == 1){
		     ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
		 }else if (primeravez == 0){
			if(seguidor){
				ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(-s.w/2), Math.floor(-s.h/2), 3*s.w, 3*s.h);
			}else{
			  	ctxt.drawImage(this.image, s.sx , s.sy, s.w, s.h, Math.floor(-s.w/2) , Math.floor(-s.h/2),s.w, s.h);
			}
		}
	    }
	    ctxt.restore();
    }else{
	if(seguidor){
		ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(x), Math.floor(y), 3*s.w, 3*s.h);
	}else{
	       //console.log("x en draw = " + x + ", y en draw = " + y + " y primeravez = " + primeravez);
	       if((x>=64 && x<=639) && (y<=575 && y>=64) && primeravez == 1){//límite(76-644)para la x, (167-674) para la y
	      		ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(x), Math.floor(y), s.w, s.h);
		}else if (primeravez == 0){//si primeravez es 0 , es porque es la pieza que tenemos que colocar(esta fuera de la cuadricula)
			ctxt.drawImage(this.image, s.sx, s.sy, s.w, s.h, Math.floor(x), Math.floor(y), s.w, s.h);
		}
	}
    }
  };
  
}


PiezaActual = function(nombre,numgiro,giro) {

  this.giro = giro;
  this.ngiro = numgiro;
  this.nombre = nombre;
  
  this.step = function(dt) {
	
  };
     
  this.draw = function(ctxt) {
	 SpriteSheet.draw(ctxt,this.nombre,10.5*64,6*64,this.giro,this.ngiro,0,true);

  };
}

cuadriculaSeguidor = function(){
    this.step = function(dt) {

    
    };
    
    this.draw = function(ctxt) {
      
	    for (i=6;i<9;i++){
        for (j=10.5;j<13.5;j++){
          Game.ctxt.strokeStyle = "red";
          Game.ctxt.strokeRect(j*64,i*64,64,64);
          Game.ctxt.beginPath();
          Game.ctxt.moveTo(10.5*64,6*64);
          Game.ctxt.lineTo(11.5*64,7*64); 
          Game.ctxt.stroke();
          Game.ctxt.beginPath();
          Game.ctxt.moveTo(13.5*64,6*64);
          Game.ctxt.lineTo(12.5*64,7*64); 
          Game.ctxt.stroke();
          Game.ctxt.beginPath();
          Game.ctxt.moveTo(13.5*64,9*64);
          Game.ctxt.lineTo(12.5*64,8*64); 
          Game.ctxt.stroke();
          Game.ctxt.beginPath();
          Game.ctxt.moveTo(10.5*64,9*64);
          Game.ctxt.lineTo(11.5*64,8*64); 
          Game.ctxt.stroke();
          ctxt.fillStyle = "red";
          ctxt.fillText("0",10.5*64+40,6*64+15);
          ctxt.fillText("1",11.5*64+30,6*64+15);
          ctxt.fillText("2",12.5*64+20,6*64+15);
          ctxt.fillText("3",12.5*64+40,6*64+50);
          ctxt.fillText("4",12.5*64+40,7*64+30);
          ctxt.fillText("5",12.5*64+40,8*64+15);
          ctxt.fillText("6",12.5*64+20,8*64+50);
          ctxt.fillText("7",11.5*64+30,8*64+50);
          ctxt.fillText("8",10.5*64+40,8*64+50);
          ctxt.fillText("9",10.5*64+10,8*64+15);
          ctxt.fillText("Q",10.5*64+10,7*64+30);
          ctxt.fillText("W",10.5*64+10,6*64+50);
          ctxt.fillText("E",11.5*64+30,7*64+15);
      
        }
      }
      
    };	
}

CapaBorra = function CapaBorra(){
    this.step = function(dt) {
    }
    
    this.draw = function(ctxt) {
    }

}

TextoPideFicha =  function TextoPideFicha(title,callback) {
  var up = false;
  
  // En cada paso, comprobamos si la tecla ha pasado de no pulsada a pulsada
  this.step = function(dt) {
  
    //if(otrapieza && (Meteor.userId() === User_IdIA)) {
        if(!Game.keys['pedirficha']) up = true;
        if(up && Game.keys['pedirficha'] && callback){ callback();
        up = false;
        }
    //}
  };
  
  this.draw = function(ctxt) {
    ctxt.fillStyle = "#FFFFFF";   
    ctxt.font = "bold 12px bangers";
    ctxt.fillText(title,10.5*64,7.8*64);
    ctxt.fillText("Pulsa tecla r para rotar",10.5*64,9.3*64);
  };   
}


AyudaScreen = function(title) {
    this.ayuda = false;
  
    var up = false;
    this.step = function (dt) {
 
    if(!Game.keys['espacio']) up = true;
    if(up && Game.keys['espacio']) {
    up = false;
    this.ayuda = !this.ayuda;
    }
    };
  
    this.draw = function(ctxt) {

    ctxt.fillStyle = "#FFFFFF";  
    ctxt.font = "bold 12px bangers";
    ctxt.fillText(title,10.5*64,1*64);
 
   
    if (this.ayuda == true) {
        ctxt.save(); 
        ctxt.fillStyle = '#6D0A0A';
        ctxt.fillRect(120,90,520,320);
        ctxt.strokeStyle="black";
        ctxt.strokeRect(120,90,520,320);
        ctxt.fillStyle='black';
        ctxt.fillText("En este menú encontraras toda la ayuda que necesites",2.1*64,1.8*64);
        ctxt.fillText("Dinámica del juego: ",2.1*64,2.1*64);
        ctxt.fillText("1º) Obten la pieza pulsando al enter.",2.1*64,2.4*64);
        ctxt.fillText("2º) Rota la pieza de la forma que quieras para conseguir la puntuación",2.1*64,2.7*64);
    ctxt.fillText("máxima pulsando la tecla r",2.1*64,3*64);
        ctxt.fillText("3º) Haz click izquierdo sobre la cuadrícula para colocar la pieza",2.1*64,3.3*64);
        ctxt.fillText("4º) Ahora puedes colocar un seguidor si quieres, mira la cuadricula roja ",2.1*64,3.6*64);
    ctxt.fillText("que está abajo a la derecha del tablero",2.1*64,3.9*64);
        ctxt.fillText("5º) Coloca a tu seguidor de la forma que puedas conseguir la puntuacion",2.1*64,4.2*64);
    ctxt.fillText("máxima",2.1*64,4.5*64);
        ctxt.fillText("6º) ¡Ya ha finalizado tu turno! Espera de forma paciente a los demás",2.1*64,4.8*64);
    ctxt.font = "bold 22px sans-serif";
    ctxt.fillText("ENJOY IT!",4.6*64,5.5*64);
        ctxt.restore();
    }
    };
  
};


// GameBoard implementa un tablero de juego que gestiona la
// interacción entre los elementos del juego sobre el que se disponen
// los elementos del juego (fichas, cartas, naves, proyectiles, etc.)
// La clase GameBoard ofrece la interfaz step(), draw() para que sus
// elementos puedan ser mostrados desde el bucle principal del juego.
// "tablero" o clase abstracta donde vamos a ir metiendo todas las cosas que se vayan añadiendo en el juego, fichas.....

TableroJuego = function() {
    var board = this;
	var removed = [];
    // Colección de objetos contenidos por este tablero
    this.objects = [];
    // Añade obj a objects
    this.add = function(obj) {
        obj.board=this; // Para que obj pueda referenciar el tablero. al objeto ademas de añadirlo a objects le paso un puntero del objeto al 
                        //tablero
        this.objects.push(obj);
        return obj;
    };
    // Los siguientes 3 métodos gestionan el borrado. Cuando un board
    // está siendo recorrido (en step()) podría eliminarse algún
    // objeto, lo que interferiría en el recorrido. Por ello borrar se
    // hace en dos fases: marcado, y una vez terminado el recorrido,
    // se modifica objects.
    // Marcar un objeto para borrar
    this.remove = function(obj) {
	console.log("entra a borrar seguidor");
    console.log("objetox es " + obj.idx);
    console.log("objetoy es " + obj.idy);
    console.log("encontrado " + obj.color);
    console.log("encontrado " + obj.type);
        removed.push(obj);
	console.log("removed" + removed);
    };
    // Inicializar la lista de objetos pendientes de ser borrados
    //this.resetRemoved = function() { removed = []; }
    // Elimina de objects los objetos pendientes de ser borrados
    this.finalizeRemoved = function() {
        for(var i=0, len=removed.length; i<len;i++) {
            // Buscamos qué índice tiene en objects[] el objeto i de
            // removed[]
            var idx = this.objects.indexOf(removed[i]);
			
            // splice elimina de objects el objeto en la posición idx
            if(idx != -1) this.objects.splice(idx,1);
        }
    }
    // Iterador que aplica el método funcName a todos los
    // objetos de objects
    //Iterate si le llamas por ejemplo con draw, lo que hará es recorrerse todos los objetos que hay en el board(tablero), y llamar al draw de esos objetos para que
    //se vayan pintando todos.
    this.iterate = function(funcName) {
        // Convertimos en un array args (1..)
        var args = Array.prototype.slice.call(arguments,1);
        _(this.objects).forEach(function (obj) {
        obj[funcName].apply(obj,args)
        })
    };
    // Devuelve el primer objeto de objects para el que func es true//Luego lo llamaremos con collide, lo que hara es recorrerse todos los objetos llamando al
    //collide de cada objeto para comprobar si hay colision. Si hay colision te devolvera el objeto.
    this.detect = function(func) {
        var encontrado = _(this.objects).find(function (obj) { return func.call(obj)})
        if (encontrado){
            return encontrado
        }else{
            return false;
        }
    };
    // Cuando Game.loop() llame a step(), hay que llamar al método
    // step() de todos los objetos contenidos en el tablero. Antes se
    // inicializa la lista de objetos pendientes de borrar, y después
    // se borran los que hayan aparecido en dicha lista
    this.step = function(dt) {
        this.iterate('step',dt);
        this.finalizeRemoved();
    };
    // Cuando Game.loop() llame a draw(), hay que llamar al método
    // draw() de todos los objetos contenidos en el tablero
    this.draw= function(ctxt) {
        this.iterate('draw',ctxt);
    };
    // Comprobar si hay intersección entre los rectángulos que
    // circunscriben a los objetos o1 y o2
    this.overlap = function(o1,o2) {
        // return !((o1 encima de o2) || (o1 debajo de o2) ||
        // (o1 a la izda de o2) || (o1 a la dcha de o2)
        return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
        (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
    };
    
    this.translateScroll = function(x,y) {
        _(this.objects).forEach(function (obj) {
                if(obj.type == "pieza") {       
                    obj.x = obj.x + 64 * x ;
                    obj.y = obj.y + 64 * y ;                                 
                }
        })
    };
    // Encontrar el primer objeto de tipo type que colisiona con obj
    // Si se llama sin type, en contrar el primer objeto de cualquier
    // tipo que colisiona con obj
    this.collide = function(obj,type) {
        return this.detect(function() {
        if(obj != this) {
            var col = (!type || this.type & type) && board.overlap(obj,this)
            return col ? this : false;
        }
        });
    };
    
    this.borrarSeguidor = function(idx,idy) {
         removed = [];
        _(this.objects).forEach(function (obj) {
                if(obj.type == "pieza") {      
                    if(obj.idx == idx && obj.idy == idy){
                            /*console.log("entra a borrar seguidor");
                            console.log("objetox es " + obj.idx);
                            console.log("objetoy es " + obj.idy);
                            console.log("encontrado " + obj.color);
                            console.log("encontrado " + obj.type);*/
			                //removed = []; //si falla hacer un borrarseguidor
                            board.remove(obj);
                            console.log("hace remove");
                    }                               
                }
        })
        board.finalizeRemoved();
    };
};




