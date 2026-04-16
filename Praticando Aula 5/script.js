async function iniciarDuelo() {
    const arena = document.getElementById('arena');
    const loading = document.getElementById('loading');
    const resultText = document.getElementById('result-text');

    try {
        const response = await fetch('https://akabab.github.io/superhero-api/api/all.json');
        const heroes = await response.json();

        const heroi1 = heroes[Math.floor(Math.random() * heroes.length)];
        const heroi2 = heroes[Math.floor(Math.random() * heroes.length)];

        const calcularPoder = (h) => {
            return Object.values(h.powerstats).reduce((total, atual) => total + atual, 0);
        };

        const poder1 = calcularPoder(heroi1);
        const poder2 = calcularPoder(heroi2);

        loading.style.display = 'none';
        arena.style.display = 'flex';

        exibirHeroi(heroi1, 'hero1', poder1);
        exibirHeroi(heroi2, 'hero2', poder2);

        const h1Card = document.getElementById('hero1');
        const h2Card = document.getElementById('hero2');

        // LÓGICA DE VENCEDOR / EMPATE
        if (poder1 > poder2) {
            resultText.innerText = `🏆 ${heroi1.name} Venceu!`;
            h1Card.classList.add('winner-animate');
            h2Card.classList.add('loser-animate');

            setTimeout(() => {
                h1Card.classList.remove('winner-animate');
                h1Card.classList.add('winner'); 
                h2Card.classList.remove('loser-animate');
            }, 3000);

        } else if (poder2 > poder1) {
            resultText.innerText = `🏆 ${heroi2.name} Venceu!`;
            h2Card.classList.add('winner-animate');
            h1Card.classList.add('loser-animate');

            setTimeout(() => {
                h2Card.classList.remove('winner-animate');
                h2Card.classList.add('winner');
                h1Card.classList.remove('loser-animate');
            }, 3000);

        } else {
            // --- CASO DE EMPATE ---
            resultText.innerText = "⚔️ EMPATE TÉCNICO!";
            h1Card.classList.add('draw-animate');
            h2Card.classList.add('draw-animate');

            setTimeout(() => {
                h1Card.classList.remove('draw-animate');
                h2Card.classList.remove('draw-animate');
                h1Card.classList.add('draw-static');
                h2Card.classList.add('draw-static');
            }, 3000);
        }

    } catch (error) {
        loading.innerText = "Erro ao carregar a API.";
        console.error(error);
    }
}

function exibirHeroi(heroi, id, total) {
    const container = document.getElementById(id);
    container.innerHTML = `
        <img src="${heroi.images.sm}" alt="${heroi.name}">
        <h3>${heroi.name}</h3>
        <p>Inteligência: ${heroi.powerstats.intelligence}</p>
        <p>Força: ${heroi.powerstats.strength}</p>
        <p>Velocidade: ${heroi.powerstats.speed}</p>
        <hr>
        <p><strong>Poder Total: ${total}</strong></p>
    `;
}

iniciarDuelo();