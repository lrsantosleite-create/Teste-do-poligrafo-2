
const perguntas = [
   "Você conhecia a vítima pessoalmente?",
    "Você teve contato com  vítima na última semana?",
    "Você mora perto da vítima?",
    "Você já trabalhou com a vítima?",
    "Você esteve no local no dia do ocorrido?",
    "Você esteve com a vítima no dia do ocorrido?",
    "Você sabe de alguma informação importante sobre o caso?",
    "Você já teve algum conflito com a vítima?",
    "Você esconde alguma informação sobre esse caso?",
    "Você teve participação no ocorrido?"
];

const respostas = Array(perguntas.length).fill(null);

let perguntaAtual = 0;

const container = document.getElementById("questions-container");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");
const progressFill = document.getElementById("progress-fill");

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const finishButton = document.getElementById("finish-button");

const quizForm = document.getElementById("quiz-form");
const resultElement = document.getElementById("result");

function mostrarPergunta() {
    const pergunta = perguntas[perguntaAtual];
    const respostaSalva = respostas[perguntaAtual];

    container.innerHTML = `
        <div class="question-card">

            <span class="question-number">
                PERGUNTA ${perguntaAtual + 1}
            </span>

            <h2>${pergunta}</h2>

            <div class="answer-options">

                <label class="answer-option">
                    <input
                        type="radio"
                        name="resposta"
                        value="sim"
                        ${respostaSalva === "sim" ? "checked" : ""}
                    >
                    <span>Sim</span>
                </label>

                <label class="answer-option">
                    <input
                        type="radio"
                        name="resposta"
                        value="nao"
                        ${respostaSalva === "nao" ? "checked" : ""}
                    >
                    <span>Não</span>
                </label>

            </div>

        </div>
    `;

    const progresso = ((perguntaAtual + 1) / perguntas.length) * 100;

    progressText.textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

    progressPercentage.textContent = `${progresso}%`;

    progressFill.style.width = `${progresso}%`;

    prevButton.disabled = perguntaAtual === 0;

    const ultimaPergunta = perguntaAtual === perguntas.length - 1;

    nextButton.hidden = ultimaPergunta;
    finishButton.hidden = !ultimaPergunta;
}

function salvarResposta() {
    const selecionada = container.querySelector(
        'input[name="resposta"]:checked'
    );

    if (!selecionada) {
        return false;
    }

    respostas[perguntaAtual] = selecionada.value;

    return true;
}

nextButton.addEventListener("click", () => {

    if (!salvarResposta()) {
        alert("Selecione Sim ou Não antes de continuar.");
        return;
    }

    if (perguntaAtual < perguntas.length - 1) {
        perguntaAtual++;
        mostrarPergunta();
    }

});

prevButton.addEventListener("click", () => {

    if (perguntaAtual > 0) {
        salvarResposta();
        perguntaAtual--;
        mostrarPergunta();
    }

});

quizForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!salvarResposta()) {
        alert("Selecione Sim ou Não antes de finalizar.");
        return;
    }

    const totalSim = respostas.filter(
        resposta => resposta === "sim"
    ).length;

    let classificacao;
    let mensagem;

    if (totalSim < 5) {

        classificacao = "Inocente";
        mensagem = "O interrogatório identificou um baixo nível de suspeita.";

    } else if (totalSim === 5) {

        classificacao = "Suspeito";
        mensagem = "O interrogatório identificou alguns pontos de suspeita durante a investigação.";

    } else if (totalSim <= 8) {

        classificacao = "Cúmplice";
        mensagem = "O interrogatório identificou vários pontos suspeitos.";

    } else {

        classificacao = "Culpado";
        mensagem = "O interrogatório identificou um nível elevado de suspeita.";

    }

    quizForm.hidden = true;

    resultElement.innerHTML = `
        <h2>Interrogatório finalizado. Suas respostas foram enviadas ao sistema e serão analisadas.</h2>

        <p>Quantidade de respostas "Sim":</p>

        <h3>${totalSim} de ${perguntas.length}</h3>

        <h3>${classificacao}</h3>

        <p>${mensagem}</p>

        <button type="button" id="restart-button">
            Refazer interrogatório
        </button>
    `;

    resultElement.hidden = false;

    document.getElementById("restart-button").addEventListener("click", reiniciarTeste);

    resultElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});

function reiniciarTeste() {

    respostas.fill(null);

    perguntaAtual = 0;

    resultElement.hidden = true;
    resultElement.innerHTML = "";

    quizForm.hidden = false;

    mostrarPergunta();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

mostrarPergunta();
