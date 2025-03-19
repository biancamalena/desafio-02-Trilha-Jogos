function filtrarSomenteNumeros(campo) {
    campo.value = campo.value.replace(/\D/g, '');
}

function validarDigitosCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function formatarTelefone(campo) {
    let numero = campo.value.replace(/\D/g, '');
    if (numero.length > 11) numero = numero.substring(0, 11);
    if (numero.length > 2) numero = `(${numero.substring(0,2)}) ${numero.substring(2)}`;
    if (numero.length > 10) numero = `${numero.substring(0,10)}-${numero.substring(10)}`;
    campo.value = numero;
}

function formatarCEP(campo) {
    let cep = campo.value.replace(/\D/g, '');
    if (cep.length > 5) cep = `${cep.substring(0,5)}-${cep.substring(5)}`;
    campo.value = cep.substring(0, 9);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const mensagemConfirmacao = document.getElementById('mensagemConfirmacao');
    const fecharMensagemBtn = document.getElementById('fecharMensagemBtn');

    const validarCampo = (campo, regex, erroId, mensagemErro) => {
        const erroElement = document.getElementById(erroId);
        if (!regex.test(campo.value.trim())) {
            campo.classList.add('invalido');
            erroElement.textContent = mensagemErro;
            erroElement.style.display = 'block';
            return false;
        }
        campo.classList.remove('invalido');
        erroElement.style.display = 'none';
        return true;
    };

    const validarArquivo = (campo, erroId) => {
        const erroElement = document.getElementById(erroId);
        if (campo.files.length === 0) {
            erroElement.textContent = 'Documento obrigatório';
            erroElement.style.display = 'block';
            campo.closest('.document__box').classList.add('invalido');
            return false;
        }
        campo.closest('.document__box').classList.remove('invalido');
        erroElement.style.display = 'none';
        return true;
    };

    document.querySelectorAll('input, select').forEach(campo => {
        campo.addEventListener('input', () => {
            const erroId = `${campo.id}__erro`;
            const erroElement = document.getElementById(erroId);
            
            switch(campo.id) {
                case 'nome':
                    validarCampo(campo, /^[A-Za-zÀ-ÿ\s']{3,}$/, erroId, 'Nome completo inválido');
                    break;
                case 'cpf':
                    filtrarSomenteNumeros(campo);
                    const cpfValido = campo.value.length === 11 && validarDigitosCPF(campo.value);
                    if (!cpfValido) {
                        erroElement.textContent = campo.value.length === 11 ? 'CPF inválido' : 'CPF deve ter 11 dígitos';
                        erroElement.style.display = 'block';
                        campo.classList.add('invalido');
                    } else {
                        erroElement.style.display = 'none';
                        campo.classList.remove('invalido');
                    }
                    break;
                case 'email':
                    validarCampo(campo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, erroId, 'E-mail inválido');
                    break;
                case 'telefone':
                    formatarTelefone(campo);
                    validarCampo(campo, /^\(\d{2}\) \d{4,5}-\d{4}$/, erroId, 'Telefone inválido');
                    break;
                case 'cep':
                    formatarCEP(campo);
                    validarCampo(campo, /^\d{5}-\d{3}$/, erroId, 'CEP inválido');
                    break;
                case 'numero':
                    validarCampo(campo, /^\d+$/, erroId, 'Apenas números permitidos');
                    break;
                case 'documento':
                case 'comprovante':
                    validarArquivo(campo, erroId);
                    break;
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let formValido = true;

        document.querySelectorAll('.mensagem__erro').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.invalido').forEach(el => el.classList.remove('invalido'));

        const camposObrigatorios = {
            nome: [/^[A-Za-zÀ-ÿ\s']{3,}$/, 'Nome completo inválido'],
            data_nascimento: [/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Data inválida'],
            cpf: [/^\d{11}$/, 'CPF inválido'],
            genero: [/^(feminino|masculino|não-binário|prefiro-nao-informar)$/, 'Selecione o gênero'],
            email: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido'],
            telefone: [/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'],
            cep: [/^\d{5}-\d{3}$/, 'CEP inválido'],
            rua: [/^[A-Za-zÀ-ÿ\s']{3,}$/, 'Rua inválida'],
            numero: [/^\d+$/, 'Número inválido'],
            cidade: [/^[A-Za-zÀ-ÿ\s']{3,}$/, 'Cidade inválida'],
            estado: [/^[A-Za-zÀ-ÿ\s']{3,}$/, 'Estado inválido']
        };

        Object.entries(camposObrigatorios).forEach(([id, [regex, mensagem]]) => {
            const campo = document.getElementById(id);
            if (!validarCampo(campo, regex, `${id}__erro`, mensagem)) formValido = false;
        });

        if (!document.querySelector('input[name="trilha"]:checked')) {
            document.getElementById('trilha__erro').style.display = 'block';
            document.querySelector('.trilha__escolhida').classList.add('invalido');
            formValido = false;
        }

        if (!document.getElementById('declaro').checked) {
            document.getElementById('declaro__erro').style.display = 'block';
            document.querySelector('.checkbox').classList.add('invalido');
            formValido = false;
        }

        ['documento', 'comprovante'].forEach(id => {
            if (!validarArquivo(document.getElementById(id), `${id}__erro`)) formValido = false;
        });

        if (formValido) {
            mensagemConfirmacao.style.display = 'flex';
            form.reset();
        }
    });

    const fecharMensagem = () => {
        mensagemConfirmacao.style.display = 'none';
    };

    fecharMensagemBtn.addEventListener('click', fecharMensagem);
    mensagemConfirmacao.addEventListener('click', (e) => {
        if (e.target === mensagemConfirmacao) fecharMensagem();
    });
});
