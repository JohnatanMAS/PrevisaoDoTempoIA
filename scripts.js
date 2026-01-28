let chaveIA = "coloque sua cheve groq aqui";

async function cliquebotao() {
    let cidade = document.querySelector(".input-cidade").value;
    let chave = "coloque sua chave openweathermap aqui";
    let caixa = document.querySelector(".caixa-media")

    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&lang=pt_br&units=metric`;
    let respostaServidor = await fetch(endereco);
    let dadosJson = await respostaServidor.json();

    console.log(dadosJson);

    caixa.innerHTML = `
        <h2 class="cidade">Tempo em ${dadosJson.name}</h2>
        <p class="temp">Temperatura: ${dadosJson.main.temp} °C</p>
        <img class="icone" src="https://openweathermap.org/payload/api/media/file/10d@2x.png" alt="Ícone do tempo">
        <p class="clima">Clima: ${dadosJson.weather[0].description}</p>
        <p class="umidade">Umidade: ${dadosJson.main.humidity} %</p>
        <p class="velocidade-vento">Velocidade do Vento: ${dadosJson.wind.speed} m/s</p>

        <button class="botao-ia" onclick="perdirRoupaIA()">Sugestão de Roupa</button>
        <p class="resposta-ia">Resposta da IA</p>
    `

}

function detectaVoz() {
    let reconhecimento = new webkitSpeechRecognition();
    reconhecimento.lang = "pt-BR";
    reconhecimento.start();

    reconhecimento.onresult = function (evento) {
        let cidade = evento.results[0][0].transcript;
        document.querySelector(".input-cidade").value = cidade;
        cliquebotao();
    }

}

async function perdirRoupaIA() {
    let temperatura = document.querySelector(".temp")?.innerText;
    let respostaIA = document.querySelector(".resposta-ia");

    let enderecoIA = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + chaveIA
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Com base na temperatura de ${temperatura}, que roupa você recomendaria para usar hoje? Responda de forma breve.`
                }
            ]
        })
    });

    let dadosIA = await enderecoIA.json();

    if (!dadosIA.choices) {
        respostaIA.innerHTML = "Erro ao consultar a IA 😢";
        console.error(dadosIA);
        return;
    }

    respostaIA.innerHTML = dadosIA.choices[0].message.content;



}
