let clicks = 0;
let aciertos = 0;
let dosCartas = [];

const jugador = [];
const jugadorInfo = {
    nombre: '',
    nivel: '',
    intentos: 0
}

const niveles = {
  'FACIL': {
    'intentos': 40
  }
}
const imagenes = [
{id: '1', src: 'img/1.jpg'},
{id: '2', src: 'img/2.jpg'},
{id: '3', src: 'img/3.jpg'},
{id: '4', src: 'img/4.jpg'},
{id: '5', src: 'img/5.jpg'},
{id: '6', src: 'img/6.jpg'},
{id: '7', src: 'img/1.jpg'},
{id: '8', src: 'img/2.jpg'},
{id: '9', src: 'img/3.jpg'},
{id: '10', src: 'img/4.jpg'},
{id: '11', src: 'img/5.jpg'},
{id: '12', src: 'img/6.jpg'},
]

const tapadaImg = { 
  name: 'tapada',
  src: 'img/tapada.jpg'
};

function comienzo(){
  $('.inicio').show();
  $('.error').hide();
  $('.main-container').hide();
  $('.images').removeClass('gris');
}

function loginJugador(){ 
  $("#facil").on("click", function() { 
    jugadorInfo.nombre = $('#name').val(); 
    jugadorInfo.nivel = 'FACIL';
      if (jugadorInfo.nombre){
        $('.inicio').hide();
        $('.main-container').show();
        $('.saludo').prepend('<p class="saludos">¡Hola ' + jugadorInfo.nombre +'!</p>')
        $('.nivel').prepend('<p class="niveles"> FACIL </p>')
        $('.num-intentos').text('18');
      } else {
        $('.error').show();
        return;
      }
  });
}

function shuffle(imagenes) { 
  for (let i = imagenes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imagenes[i], imagenes[j]] = [imagenes[j], imagenes[i]];
  }
  return imagenes;
}


function crearTablero(){
  for (let i = 0; i < imagenes.length; i++){
    let carta = $('<div class="card"></div>');
    let cartaTapadaDiv = $('<div class="cartaTapada"></div>');
    let cartaDestapadaDiv = $('<div class="cartaDestapada"></div>');
    let cartaTapadaImg = $('<img class="imgTapada" src="'+ tapadaImg.src + '">');
    let cartaDestapadaImg = $('<img class="imgDestapada" src="' + imagenes[i].src +'">');
    carta.append(cartaTapadaDiv);
    carta.append(cartaDestapadaDiv);
    cartaTapadaDiv.append(cartaTapadaImg);
    cartaDestapadaDiv.append(cartaDestapadaImg);
    $('.tablero').append(carta); 
    cartaDestapadaDiv.attr('id', imagenes[i].id); 
  }
}

function jugar(){
  $('.cartaTapada').on('click', function(){
    if (clicks <= (niveles[jugadorInfo.nivel].intentos * 2)){
      clicks++; 
      $(this).parent().addClass('visible'); 
      dosCartas.push($(this).next());
      if (dosCartas.length === 2) {
          jugadorInfo.intentos = jugadorInfo.intentos + 1;
          if (dosCartas[0].children('img').attr('src') === dosCartas[1].children('img').attr('src')
          && dosCartas[0].attr('id') !== dosCartas[1].attr('id')) { 
              dosCartas[0].addClass('gris');
              dosCartas[1].addClass('gris');
              aciertos++;
              dosCartas = [];
          }
          else {
            setTimeout(function(){ 
              dosCartas[0].parent().removeClass('visible')
              dosCartas[1].parent().removeClass('visible')
              dosCartas = [];
            },800)
          }   
      }
      ganaPierde();
  } 
  $('.contador-intentos').text('Intentos: ' + jugadorInfo.intentos);
  }) 
};

function ganaPierde(){
  if (aciertos === 6) { 
    $('#modal').removeClass('oculto');
    $('#gana').removeClass('oculto');
    $('.intentos-span').text(jugadorInfo.intentos).css('color', 'black');
    guardarJugador();
    armarRanking();
  }

}; 

function guardarJugador (){
  let jugadorJSON = localStorage.getItem('jugador');
  if (jugadorJSON == null) {
    jugadorJSON = []
  } else {
    jugadorJSON = JSON.parse(jugadorJSON)
  }
  jugadorJSON.push(jugadorInfo);
  localStorage.setItem('jugador', JSON.stringify(jugadorJSON));
};

function armarTabla() {
  let tablaJugadores = $('<table id="tablaRanking"></table>')
  let cabecera = '<th>Nombre</th><th>Nivel</th><th>Intentos</th>'
  tablaJugadores.append(cabecera)
  let container = $('.ranking');
  container.append(tablaJugadores);
}


function armarRanking() { 
  let infoJugador = JSON.parse(localStorage.getItem('jugador'));
  let tablaJugadores = $('#tablaRanking');
  for (let i = 0; i < infoJugador.length; i++) {
    let nombreInfo = "<td>" + infoJugador[i].nombre + "</td>";
    let nivelInfo = "<td>" + infoJugador[i].nivel + "</td>";
    let intentosInfo = "<td>" + infoJugador[i].intentos + "</td>";
    let fila = $('<tr class="fila"></tr>');
    fila.append(nombreInfo);
    fila.append(nivelInfo);
    fila.append(intentosInfo);
    tablaJugadores.append(fila);
  }
} 

function jugarDeNuevo(){
  $('.volver-jugar').on('click', function () {
    $('.card').remove();
    $('#modal').addClass('oculto');
    $('#gana').addClass('oculto');
    $('#pierde').addClass('oculto');
    clicks = 0;
    aciertos = 0;
    dosCartas = [];
    location.reload();
  })
}

comienzo();
loginJugador();
shuffle(imagenes);
crearTablero();
jugar();
armarTabla();
jugarDeNuevo();