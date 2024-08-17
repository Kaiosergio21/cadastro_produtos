// Adicionar produto e atualizar a lista
document.getElementById('dados_produto').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const dados = Object.fromEntries(formData.entries());

    fetch('/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Sucesso:', data);

        const mensagemElemento = document.getElementById('mensagem-sucesso');
        mensagemElemento.textContent = 'Produto enviado com sucesso';
        mensagemElemento.style.display = 'block';

        carregarProdutos(); // Atualiza a lista após adicionar um novo produto

        event.target.reset();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

function carregarProdutos() {
    fetch('/produtos')
    .then(response => response.json())
    .then(produtos => {
        const listaProdutos = document.getElementById('lista-produtos');
        listaProdutos.innerHTML = ''; // Limpar lista antes de adicionar produtos
        produtos.forEach(produto => {
            adicionarProdutoNaLista(produto);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar produtos:', error);
    });
}

function adicionarProdutoNaLista(produto) {
    const listaProdutos = document.getElementById('lista-produtos');
    const itemProduto = document.createElement('li');
    itemProduto.innerHTML = `Nome: ${produto.nome}, Preço: R$ ${parseFloat(produto.preco).toFixed(2)} `;

    // Criar botão de editar
    const editarBotao = document.createElement('button');
    editarBotao.textContent = 'Editar';
    editarBotao.addEventListener('click', function() {
        editarProduto(itemProduto, produto);
    });

    // Criar botão de deletar
    const deletarBotao = document.createElement('button');
    deletarBotao.textContent = 'Deletar';
    deletarBotao.addEventListener('click', function() {
        deletarProduto(itemProduto, produto);
    });

    // Adicionar botões ao item do produto
    itemProduto.appendChild(editarBotao);
    itemProduto.appendChild(deletarBotao);
    listaProdutos.appendChild(itemProduto);
}

function editarProduto(itemProduto, produto) {
    const novoNome = prompt('Editar nome do produto:', produto.nome);
    const novoPreco = prompt('Editar preço do produto:', produto.preco);

    if (novoNome && novoPreco) {
        // Atualiza o HTML do item do produto
        itemProduto.innerHTML = `Nome: ${novoNome}, Preço: R$ ${parseFloat(novoPreco).toFixed(2)} `;

        // Criar e adicionar botões de editar e deletar
        const editarBotao = document.createElement('button');
        editarBotao.textContent = 'Editar';
        editarBotao.addEventListener('click', function() {
            editarProduto(itemProduto, { ...produto, nome: novoNome, preco: novoPreco });
        });

        const deletarBotao = document.createElement('button');
        deletarBotao.textContent = 'Deletar';
        deletarBotao.addEventListener('click', function() {
            deletarProduto(itemProduto, { ...produto, nome: novoNome, preco: novoPreco });
        });

        itemProduto.appendChild(editarBotao);
        itemProduto.appendChild(deletarBotao);

        // Enviar requisição ao backend para atualizar o produto no banco de dados
        fetch(`/update/${produto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: novoNome, preco: novoPreco })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Produto atualizado:', data);
        })
        .catch(error => {
            console.error('Erro ao atualizar produto:', error);
        });
    }
}

function deletarProduto(itemProduto, produto) {
    itemProduto.remove();

    fetch(`/delete/${produto.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log('Produto deletado:', data);
    })
    .catch((error) => {
        console.error('Erro ao deletar produto:', error);
    });
}

// Carregar produtos ao clicar no botão "Carregar Produtos"
document.getElementById('carregar-produtos').addEventListener('click', function() {
    carregarProdutos();
});

// Carregar produtos automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
});
