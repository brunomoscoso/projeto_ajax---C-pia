$(document).ready(function () {
 /**   setTimeout(function () {
        alert("Bem-vindo(a) ao nosso website!");
    }, 5000); 
*/ 
// Botao ver todos
    const botaoVerTodos = $('#vertodos');
    const TodosOsBolos = $('#todos-os-bolos');
    const areaProduto = $('#area-produto');

    function mostrarArea() {
        TodosOsBolos.toggle();
        areaProduto.hide();
    }

    botaoVerTodos.on('click', mostrarArea);


// Cards Bolos
$('.imagem-card').on('click', function (e) {
        e.preventDefault();
        const imageUrl = $(this).find('img').attr('src');
        const description = $(this).find('p').text();

        $('#imagem-modal').attr('src', imageUrl);

        const boloId = $(this).closest('li').index();
        const listaTipo = $(this).closest('ul').attr('id');

        $.ajax({
            url: 'assets/data/bolos.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                let bolo;
                if (listaTipo === 'lista-bolos-g') {
                    bolo = data.bolos.grande[boloId];
                } else if (listaTipo === 'lista-bolos-mini') {
                    bolo = data.bolos.mini[boloId];
                } else if (listaTipo === 'lista-bolos-esp') {
                    bolo = data.bolos.especial[boloId];
                } else if (listaTipo === 'lista-bolos-extras') {
                    bolo = data.bolos.extra[boloId];
                }

                $('#titulo-card').text(bolo.nome);
                $('#modal-description').text(bolo.descricao);
                $('#area-produto').fadeIn();
            },
            error: function () {
                console.error('Erro ao carregar os dados.');
                alert('Não foi possível carregar as informações do bolo.');
            }
        });
    });

    $('#area-produto').on('click', function (e) {
        if ($(e.target).is('#area-produto')) {
            $(this).fadeOut();
        }
    });

    // Galeria Grid
    $('.imagem').on('click', function () {
        const imgSrc = $(this).attr('src');
        $('#modal-image').attr('src', imgSrc);
        $('#photo-modal').fadeIn();
    });

    $('#photo-modal').on('click', function () {
        $(this).fadeOut();
    });

    // RSS - Carrega conteúdo de um feed RSS
    $.ajax({
        url: 'assets/data/receitas.xml',
        dataType: 'xml',
        success: function (data) {
            let content = '<ul class="custom-ul">';
            $(data).find('item').each(function () {
                const title = $(this).find('title').text();
                const link = $(this).find('link').text();
                const description = $(this).find('description').text();
                content += `<li class="custom-lista">
                    <h3><a class="custom-link" href="${link}" target="_blank">${title}</a></h3>
                    <p class="custom-para">${description}</p>
                    </li>`;
            });
            content += '</ul>';
            $('#rec').html(content);
        },
        error: function () {
            $('#rec').text('Erro ao carregar o RSS.');
        },
    });

    // Funcionalidade do Mapa 
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var routeControl;
    var destinos = {
        lisboa: L.latLng(38.7335304, -9.1410818),
        porto: L.latLng(41.14961, -8.611)  
    };

    $('#show-map-lisboa').on('click', function (event) {
        event.preventDefault();
        showMap(destinos.lisboa); 
    });

    $('#show-map-porto').on('click', function (event) {
        event.preventDefault();
        showMap(destinos.porto); 
    });

    function showMap(destino) {
        $('#mapa-area').fadeIn(); 
        $('#map').show();  
        map.locate({ setView: true, maxZoom: 16 });
        map.on('locationfound', function (event) {
            var userLocation = event.latlng;  

            L.marker(userLocation).addTo(map)
                .bindPopup("Você está aqui!")
                .openPopup();

            if (routeControl) {
                map.removeControl(routeControl); 
            }
            routeControl = L.Routing.control({
                waypoints: [userLocation, destino]  
            }).addTo(map);
        });
    }
});

