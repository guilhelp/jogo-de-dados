// Classe de entidade representando o dado
class Dado {
  constructor() {
    this.face = 1;
  }

  lancar() {
    this.face = Math.floor(Math.random() * 6) + 1;
  }

  getFace() {
    return this.face;
  }
}

// Classe de controle
class JogoController {
  // Injeção de dependência por meio do construtor
  constructor(dado1, dado2) {
    this.dado1 = dado1;
    this.dado2 = dado2;
  }

  iniciar() {
    this.dado1.lancar();
    this.dado2.lancar();
  }

  verificarVitoria() {
    return this.dado1.getFace() + this.dado2.getFace() == 7;
  }

  getDados() {
    return [this.dado1.getFace(), this.dado2.getFace()];
  }
}

// Classe de fronteira para o jogo
class Jogo {
  // Injeção de dependência
  constructor(jogoController) {
    this.jogoController = jogoController;

    // Construção da tela inicial através de código invés de HTML puro
    this.mainWindow = document.createElement("main");
    this.mainWindow.classList.add("main");

    const title = document.createElement("h1");
    title.textContent = "Jogo de Dados";
    this.mainWindow.appendChild(title);

    const startButton = document.createElement("button");
    startButton.id = "startButton";
    startButton.textContent = "Iniciar";
    startButton.addEventListener("click", this.iniciarJogo.bind(this));
    this.mainWindow.appendChild(startButton);

    // A tela de jogo
    this.gameWindow = document.createElement("main");
    this.gameWindow.classList.add("game");
    this.gameWindow.appendChild(title);

    const dicesContainer = document.createElement("div");
    dicesContainer.id = "dicesContainer";

    const dice1 = document.createElement("img");
    dice1.id = "dice1";
    const dice2 = document.createElement("img");
    dice2.id = "dice2";

    dicesContainer.appendChild(dice1);
    dicesContainer.appendChild(dice2);

    this.gameWindow.appendChild(dicesContainer);

    const resultsButton = document.createElement("button");
    resultsButton.id = "resultsButton";
    resultsButton.textContent = "Ver resultados";
    resultsButton.disabled = true;

    resultsButton.addEventListener("click", this.verResultados.bind(this));

    this.gameWindow.appendChild(resultsButton);

    // A tela de resultado
    this.resultsWindow = document.createElement("main");
    this.resultsWindow.classList.add("results");

    const resultContainer = document.createElement("div");
    resultContainer.id = "resultContainer";

    const resultLabel = document.createElement("h1");
    resultLabel.id = "resultLabel";
    this.resultsWindow.appendChild(resultLabel);

    const sumLabel = document.createElement("h2");
    sumLabel.id = "sumLabel";
    sumLabel.textContent = "Resultado: ";
    this.resultsWindow.appendChild(sumLabel);

    resultContainer.appendChild(resultLabel);
    resultContainer.appendChild(sumLabel);

    this.resultsWindow.appendChild(resultContainer);

    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Jogar novamente";
    playAgainButton.addEventListener("click", this.iniciarJogo.bind(this));
    this.resultsWindow.appendChild(playAgainButton);

    // Iniciando a interface com a tela inicial
    document.body.innerHTML = "";
    document.body.appendChild(this.mainWindow);
  }

  iniciarJogo() {
    // Alterando a interface para a tela do jogo
    document.body.innerHTML = "";
    document.body.appendChild(this.gameWindow);

    // Iniciando o jogo
    this.jogoController.iniciar();
    const dados = this.jogoController.getDados();

    const frames = 24;
    const desiredTime = 3; // 3 segundos
    let totalFrames = desiredTime * frames;
    let counter = 0;

    // Fazendo animação de rolar os dados
    const animation = setInterval(() => {
      const random = Math.floor(Math.random() * 6) + 1;
      document.getElementById("dice1").src = `images/dice-${random}.svg`;
      document.getElementById("dice2").src = `images/dice-${random}.svg`;
      counter++;
      if (counter >= totalFrames) {
        clearInterval(animation);
        document.getElementById("resultsButton").disabled = false;
        // Exibindo os dados
        document.getElementById("dice1").src = `images/dice-${dados[0]}.svg`;
        document.getElementById("dice2").src = `images/dice-${dados[1]}.svg`;
      }
    }, 1000 / frames);
  }

  verResultados() {
    // Alterando a interface para a tela de resultados
    document.body.innerHTML = "";
    document.body.appendChild(this.resultsWindow);
    const resultado = this.jogoController.verificarVitoria();
    const dados = this.jogoController.getDados();
    document.getElementById("sumLabel").textContent =
      "Resultado: " +
      dados[0] +
      " + " +
      dados[1] +
      " = " +
      (dados[0] + dados[1]);
    document.getElementById("resultLabel").textContent = resultado
      ? "Você ganhou!"
      : "Você perdeu :(";
  }
}

// Instanciando os objetos
const dado1 = new Dado();
const dado2 = new Dado();
const jogoController = new JogoController(dado1, dado2);

new Jogo(jogoController);
