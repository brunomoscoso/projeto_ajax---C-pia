$(document).ready(function () {
    // Manipulador de mudanças na seleção de tipos de bolo
    $('#options').change(function () {
        const selectedValue = $(this).val();
        const imageDisplay = $('#image-display');
        const legenda = $('#legenda-bolo');
        imageDisplay.empty(); // Limpa a área de exibição da imagem e legenda

        let imagePath = '';
        let imageLegenda = '';

        switch (selectedValue) {
            case 'bolo-numeral':
                imagePath = '../../assets/images/bolo-especial/bolo-numero.jpg';
                imageLegenda = 'Bolo serve até 28 fatias';
                break;
            case 'bolo-alfabeto':
                imagePath = '../../assets/images/bolo-especial/bolo-especial-a.jpg';
                imageLegenda = 'Bolo serve até 28 fatias';
                break;
            case 'bolo-personalizado':
                imagePath = '../../assets/images/imagem_bolo/bolo-happy.jpg';
                imageLegenda = 'Bolo de 20cm serve até 28 fatias';
                break;
            case 'bolo-casamento':
                imagePath = '../../assets/images/bolo-especial/bolo-casamento.jpg';
                imageLegenda = 'Bolo clássico de casamento serve até 100 fatias!';
                break;
            default:
                imagePath = '';
                imageLegenda = '';
        }

        if (imagePath) {
            const img = $('<img>').attr('src', imagePath).attr('alt', selectedValue);
            const p = $('<p class="legenda-bolo">').text(imageLegenda); 
            imageDisplay.append(img).append(p); 
        } else {
            alert("Por favor, selecione o tipo de bolo.");
        }
    });

    // Restrição de seleção de recheios
    $('input[name="recheio[]"]').on('change', function() {
        var checkedRecheios = $('input[name="recheio[]"]:checked').length;
        if (checkedRecheios > 2) {
            alert("Você pode selecionar no máximo 2 recheios.");
            $(this).prop('checked', false);
        }
    });

    // Restrição de seleção de massa
    $('input[name="massa[]"]').on('change', function() {
        if ($('input[name="massa[]"]:checked').length > 1) {
            alert("Você pode selecionar apenas uma massa.");
            $(this).prop('checked', false);
        }
    });

    // Restrição de seleção de cobertura
    $('input[name="cobertura[]"]').on('change', function() {
        if ($('input[name="cobertura[]"]:checked').length > 1) {
            alert("Você pode selecionar apenas uma cobertura.");
            $(this).prop('checked', false); 
        }
    });

    // Validação de formulário
    $('form').on('submit', function(event) {
        if (!validar()) { 
            event.preventDefault(); // Impede o envio se a validação falhar
        }
    });

    // Função de cálculo de desconto
    function calcularDesconto(precoOriginal, prazo) {
        let desconto = 0;
        
        if (prazo) {
            let hoje = new Date();
            let dataEntrega = new Date(prazo);
            let diffTime = dataEntrega - hoje; 
            let diffDays = diffTime / (1000 * 3600 * 24); 
            
            if (diffDays > 30) {
                desconto = precoOriginal * 0.10;  // 10% de desconto
            } else if (diffDays > 15) {
                desconto = precoOriginal * 0.05;  // 5% de desconto
            }
        }
        
        return desconto;
    }

    // Função para atualizar o total
    function atualizarTotal() {
        let precoOriginal = 0;
        let total = 0;

        $('.item-option input[type="checkbox"]:checked').each(function() {
            let precoTexto = $(this).siblings('.preco').text().trim();
            let preco = parseFloat(precoTexto.replace(',', '.'));
            if (!isNaN(preco)) {
                precoOriginal += preco; 
                total += preco; 
            }
        });

        const tipoBolo = $('#options').val();
        let boloCasamentoAdicional = 0;
        
        if (tipoBolo === 'bolo-casamento') {
            boloCasamentoAdicional = 40;
            total += boloCasamentoAdicional;  
        }

        let prazo = $('#prazo').val();
        let desconto = calcularDesconto(precoOriginal, prazo);
        total = precoOriginal - desconto + boloCasamentoAdicional;

        if (prazo) {
            $('#dataEntrega').text(prazo); 
        }

        $('#precoOriginal').text(precoOriginal.toFixed(2));
        $('#desconto').text(desconto.toFixed(2));
        $('#boloCasamentoAdicional').text(boloCasamentoAdicional.toFixed(2)); 
        $('#total').text(total.toFixed(2)); 
    }

    // Atualizar o total sempre que houver mudança nos inputs
    $('input[type="checkbox"], #prazo, #options').change(function() {
        atualizarTotal();
    });

    // Calcular o total ao carregar a página
    atualizarTotal();

  // Chamar a função validar no evento submit
    $('form').on('submit', function(event) {
    if (!validar()) {
        event.preventDefault(); // Evita o envio do formulário se a validação falhar
    }
    });

  // Remover eventos antigos e adicionar apenas um evento de submit
$('form').off('submit').on('submit', function (event) {
    if (!validar()) {
        event.preventDefault(); // Impede o envio do formulário
    }
});

// Função de validação de dados
function validar() {
    const nome = $('#nome').val().trim();
    const apelido = $('#apelido').val().trim();
    const telefone = $('#telefone').val().trim();
    const email = $('#email').val().trim();

    const regNomeApelido = /^[A-Za-zÀ-ÿ\s]+$/;
    const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (nome === "") {
        alert("Por favor, preencha o nome.");
        return false;
    }
    if (!regNomeApelido.test(nome)) {
        alert("O nome deve conter apenas letras e espaços.");
        return false;
    }
    if (apelido === "") {
        alert("Por favor, preencha o apelido.");
        return false;
    }
    if (!regNomeApelido.test(apelido)) {
        alert("O apelido deve conter apenas letras e espaços.");
        return false;
    }
    if (email === "") {
        alert("Por favor, preencha o e-mail.");
        return false;
    }
    if (telefone === "") {
        alert("Por favor, preencha o telefone.");
        return false;
    }
    if (isNaN(telefone)) {
        alert("O telefone deve conter apenas números.");
        return false;
    }
    if (telefone.length !== 9) {
        alert("O número deve ter 9 dígitos.");
        return false;
    }
    if (!telefone.startsWith('9')) {
        alert("O número deve começar com 9.");
        return false;
    }

    alert('Formulário enviado com sucesso!');
    return true;
}
});
