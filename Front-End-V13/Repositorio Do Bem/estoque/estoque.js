//Configurações do menu
var btn = document.querySelector('#menu-btn')
var menu = document.querySelector('#menu-list')

btn.addEventListener('click', function () {
  menu.classList.toggle('expandir')
})

//Config perfil
var btnPerfil = document.querySelector('#user-icon')
var perfil = document.querySelector('#perfil-list')

btnPerfil.addEventListener('click', function () {
  perfil.classList.toggle('expand')
})

//Configurações do modal

// Seleciona o botão e o modal
var btnModal = document.getElementById("btn-add");
var modal = document.getElementById("modal");

// Seleciona o elemento que fecha o modal
var closeBtn = document.getElementsByClassName("close")[0];

// Quando o usuário clicar no botão, o modal é exibido
btnModal.onclick = function () {
  modal.style.display = "block";
}

// Quando o usuário clicar no "x", o modal é ocultado
closeBtn.onclick = function () {
  modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, ele é ocultado
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var btnDoar = document.getElementById("doe")
var modalDoar = document.getElementById("modal-doacao")

var closeButton = document.getElementsByClassName("close-doacao")[0];

btnDoar.onclick = function () {
  modalDoar.style.display = "block";
}

closeButton.onclick = function () {
  modalDoar.style.display = "none";
}

//Configurações da tabela

// Botão de adicionar do modal
var addBtn = document.getElementById("btn-adc");

//Seleciona a tabela e o corpo dela
var table = document.getElementById("table");
var tbody = table.getElementsByTagName("tbody")[0];

// Botão para excluir dados selecionados
var deleteBtn = document.getElementById("btn-delete");

// Botão para gerar o relatório
var relatorioBtn = document.getElementById("btn-relatorio");

addBtn.onclick = function () {
  let inputAlimento = document.getElementById("input01").value.trim();
  let inputQuantia = document.getElementById("input02").value.trim();
  let inputValidade = document.getElementById("input03").value.trim();
  

  if (inputAlimento === "" || inputQuantia === "" || inputValidade === "" ) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Adicionar novo alimento na tabela
  let newRow = tbody.insertRow();

  let cellAlimento = newRow.insertCell();
  let cellQuantidade = newRow.insertCell();
  cellAlimento.textContent = inputAlimento;
  cellQuantidade.textContent = inputQuantia;

  // Limpa os campos do modal
  document.getElementById("input01").value = "";
  document.getElementById("input02").value = "";
  document.getElementById("input03").value = "";

  modal.style.display = "none";

  alert("Alimento adicionado");

  // Adicionar o alimento ao servidor
  let nomeMinusculo = inputAlimento.toLowerCase();
  let nomeFormatado = nomeMinusculo
    .replace(/[áàãâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòõôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ç]/g, 'c');

  for (let i = 0; i < inputQuantia; i++) {
    fetch('http://localhost:5555/saveAlimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nome": nomeFormatado,
        "peso": inputQuantia,
        "validade": inputValidade,
        "idDoador": "5",
        "emailDoador": ""
      })
    });
  }
};

/* // Função para excluir dados selecionados
deleteBtn.onclick = function () {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  checkboxes.forEach(function (checkbox) {
    var row = checkbox.closest('tr');
    row.parentNode.removeChild(row);
  });
} */

// Função para mudar a cor da linha selecionada
tbody.addEventListener("click", function (event) {
  if (event.target.type === "checkbox") {
    var targetRow = event.target.closest("tr"); // Obtém a linha clicada
    if (event.target.checked) {
      targetRow.classList.add("selected");
    } else {
      targetRow.classList.remove("selected");
    }
  }
});


//get alimentos
let alimentos = []
let QuantidadeAlimentos = []
let qtdUnidade = new Array(alimentos.length).fill(0)
fetch('http://localhost:5555/getAllAlimentos')
  .then((res) => {
    return res.json();
  })
  .then((data) => {

    let idsFor = []
    for (let i = 0; i < data.length; i++) {
      let objID = { "id": data[i].alimentoId, "alimento": data[i].nome }
      idsFor.push(objID);

      if (!alimentos.includes(data[i].nome)) {
        alimentos.push(data[i].nome)
      }


    }
    //console.log(idsFor)
    //verificando qtd de cada alimento 

    let h = new Array(alimentos.length).fill(0)
    for (let i = 0; i < data.length; i++) {
      let alimentoMinusculo = data[i].nome.toLowerCase()

      let alimentoFormatado = alimentoMinusculo
        .replace(/[áàãâä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòõôö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c');


      for (let j = 0; j < h.length; j++) {
        if (alimentoFormatado === alimentos[j]) {
          h[j] = h[j] + 1;
        }
      }
    }

    for (let i = 0; i < alimentos.length; i++) {

      const nomeAlimento = `
      <p>${alimentos[i]}</p>
      
      `

      const Quantidade = `
      <p>${h[i]}</p>
      
      `
      const check = `
      <input type="checkbox" id="checkbox${i} placeholder="selecione">
      <br color="white">
      `

      document.querySelector("#checkbox").insertAdjacentHTML("beforeend", check)
      document.querySelector("#nomeAlimento").insertAdjacentHTML("beforeend", nomeAlimento)
      document.querySelector("#Quantia").insertAdjacentHTML("beforeend", Quantidade)
    }

    QuantidadeAlimentos = h

    //adicionando grafico
    criarGrafico(h);
  })


let alimentoPesquisado = ""
let qtdAlimentoPesquisado = 0
function pesquisar() {
  const searchInput = document.querySelector("#busca").value;
  let verificacaoTabela = false
  for (let i = 0; i < alimentos.length; i++) {
    if (searchInput === alimentos[i]) {
      alimentoPesquisado = searchInput
      qtdAlimentoPesquisado = QuantidadeAlimentos[i]

      const nomeAlimento = `
        <p style="background-color: yellow; color: black;">${alimentoPesquisado}</p>
        `

      const Quantidade = `
        <p border=0px solid(white) style="background-color: yellow; color: black;">${qtdAlimentoPesquisado}</p>
        `
      document.querySelector("#nomeAlimentoPesquisado").insertAdjacentHTML("beforeend", nomeAlimento)
      document.querySelector("#QuantiaPesquisado").insertAdjacentHTML("beforeend", Quantidade)

      verificacaoTabela = true
    }
  }

  if (verificacaoTabela == false) {
    alert("ALIMENTO NÃO ENCONTRADO")
  }
}

//grafico
function criarGrafico(data_qtd) {

  var tagGrafico = document.getElementById('myChart').getContext('2d');

  var myChart = new Chart(tagGrafico, {
    type: 'bar',
    data: {
      labels: alimentos,
      datasets: [{
        label: '# of Votes',
        data: data_qtd,
        backgroundColor: [
          "#FFA500CC", "#800080CC", "#00FFFFCC", "#FFD700CC", "#FF0000CC",
          "#00FF7FCC", "#FF8C00CC", "#FF6347CC", "#800080CC", "#FFA500CC",
          "#FF6347CC", "#FF6347CC", "#FF6347CC", "#FF6347CC", "#800080CC",
          "#800080CC", "#4682B4CC", "#FF6347CC", "#FF6347CC", "#FF6347CC",
          "#FF6347CC", "#4682B4CC", "#FFD700CC", "#800080CC", "#FF6347CC",
          "#FF0000CC", "#FF0000CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#FF0000CC", "#FF6347CC", "#FF6347CC", "#FF0000CC", "#FFA500CC",
          "#FF0000CC", "#00FF7FCC", "#FFA500CC", "#800080CC", "#FF0000CC",
          "#800080CC", "#FFA500CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#00FFFFCC", "#00FF7FCC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#FFA500CC", "#800080CC", "#FF6347CC", "#800080CC", "#FFD700CC",
          "#FFA500CC", "#800080CC", "#FF6347CC", "#FFA500CC", "#800080CC",
          "#00FFFFCC", "#FFA500CC", "#FFA500CC", "#FF0000CC", "#FFD700CC",
          "#FF6347CC", "#FF6347CC", "#FFD700CC", "#FF6347CC", "#FF0000CC",
          "#FF0000CC", "#FFD700CC", "#800080CC", "#FF6347CC", "#FFA500CC",
          "#00FF7FCC", "#FF0000CC", "#FFA500CC", "#800080CC", "#FF6347CC",
          "#800080CC", "#FF0000CC", "#FF0000CC", "#800080CC", "#FFA500CC",
          "#FF6347CC", "#FFA500CC", "#FF6347CC", "#800080CC", "#00FFFFCC",
          "#FF0000CC", "#FFA500CC", "#FFD700CC", "#FF6347CC", "#FF6347CC",
          "#FFA500CC", "#FFA500CC", "#FF0000CC", "#FFA500CC", "#FFA500CC",
          "#FF0000CC", "#800080CC", "#FF6347CC", "#FFA500CC", "#FF6347CC"
        ],
        borderColor: [
          "#FFA500", "#800080", "#00FFFF", "#FFD700", "#FF0000",
          "#00FF7F", "#FF8C00", "#FF6347", "#800080", "#FFA500",
          "#FF6347", "#FF6347", "#FF6347", "#FF6347", "#800080",
          "#800080", "#4682B4", "#FF6347", "#FF6347", "#FF6347",
          "#FF6347", "#4682B4", "#FFD700", "#800080", "#FF6347",
          "#FF0000", "#FF0000", "#800080", "#FF6347", "#FFA500",
          "#FF0000", "#FF6347", "#FF6347", "#FF0000", "#FFA500",
          "#FF0000", "#00FF7F", "#FFA500", "#800080", "#FF0000",
          "#800080", "#FFA500", "#800080", "#FF6347", "#FFA500",
          "#00FFFF", "#00FF7F", "#800080", "#FF6347", "#FFA500",
          "#FFA500", "#800080", "#FF6347", "#800080", "#FFD700",
          "#FFA500", "#800080", "#FF6347", "#FFA500", "#800080",
          "#00FFFF", "#FFA500", "#FFA500", "#FF0000", "#FFD700",
          "#FF6347", "#FF6347", "#FFD700", "#FF6347", "#FF0000",
          "#FF0000", "#FFD700", "#800080", "#FF6347", "#FFA500",
          "#00FF7F", "#FF0000", "#FFA500", "#800080", "#FF6347",
          "#800080", "#FF0000", "#FF0000", "#800080", "#FFA500",
          "#FF6347", "#FFA500", "#FF6347", "#800080", "#00FFFF",
          "#FF0000", "#FFA500", "#FFD700", "#FF6347", "#FF6347",
          "#FFA500", "#FFA500", "#FF0000", "#FFA500", "#FFA500",
          "#FF0000", "#800080", "#FF6347", "#FFA500", "#FF6347"
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function QueroDoar() {
  window.location.href = '../Ponto_coleta/ponto_coleta.html'
}

function Estoque() {
  window.location.href = '../estoque/estoque.html'
}

function GerarPdf() {
  let documentoPDF = new jsPDF();

  let htmlContent = `
    <html>
      <head>
        <title>Relatório de Alimentos</title>
        <style>
          *{
            font-family="Poppins"
          }
          h2{
            font-size: 30px
          }
        </style>
      </head>
      <body>
        <h2>Lista de Alimentos:</h2>
        <ul>
  `;

  for (let i = 0; i < alimentos.length; i++) {
    htmlContent += `<li><h3>${alimentos[i]} - Quantidade = ${QuantidadeAlimentos[i]}</h3></li>`;
  }

  htmlContent += `
          </ul>
        </body>
      </html>
  `;
  documentoPDF.fromHTML(htmlContent, 35, 2, {}, function () {
    documentoPDF.save('Relatorio.pdf');
  });
}


function doacao() {

  fetch('http://localhost:5555/getAllAlimentos')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let idsFor = []
      for (let i = 0; i < data.length; i++) {
        let objID = { "id": data[i].alimentoId, "alimento": data[i].nome }
        idsFor.push(objID);
      }
      console.log(idsFor)

      let alimentoModal = document.querySelector("#ali").value
      let QuantidadeModal = document.querySelector("#qtde").value

      let verificacaoAlimento = false
      let verificacaoQtd = false

      for (let i = 0; i < alimentos.length; i++) {
        if (alimentoModal == alimentos[i]) {
          verificacaoAlimento = true
          if (QuantidadeModal <= QuantidadeAlimentos[i]) {
            verificacaoQtd = true
            QuantidadeAlimentos[i] = QuantidadeAlimentos[i] - QuantidadeModal
          }
        }
      }

      let listaAlimentoDoado = []
      for (let o = 0; o <= alimentos.length; o++) {
        if (idsFor[o].alimento == alimentoModal) {
          listaAlimentoDoado.push(idsFor[o].id)
        }
      }

      console.log(listaAlimentoDoado, "--")

      if (verificacaoAlimento == true && verificacaoQtd == true) {
        for (let x = 0; x < listaAlimentoDoado.length; x++) {
          let id = listaAlimentoDoado[x]
          console.log(id)
          fetch(`http://localhost:5555/deleteAlimento/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          }).then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
        }
        console.log(data)

        //alimentos = []

        let documentoPDF = new jsPDF();

        let htmlContent = `
    <html>
      <head>
        <title>Relatório de doação</title>
        <style>
          *{
            font-family="Poppins"
          }
          h2{
            font-size: 30px
          }
        </style>
      </head>
      <body>
        <h2>Lista de alimentos doados:</h2>
        <ul>
  `;

        
          htmlContent += `<li><h3>Alimento: ${idsFor[0].alimento} '\n'  Quantidade: ${QuantidadeModal}</h3></li>`;
        

        htmlContent += `
          </ul>
        </body>
      </html>
  `;
        documentoPDF.fromHTML(htmlContent, 35, 2, {}, function () {
          documentoPDF.save('doacao.pdf');
        });
      } else {
        alert("incorreto")
      }
    })


}

