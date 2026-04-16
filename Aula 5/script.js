const container = document.getElementById('recipe-container');

// Função que traduz qualquer texto de Inglês para Português
async function traduzirTexto(texto) {
    if (!texto) return "";
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-br`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Erro na tradução:", error);
        return texto; // Se a tradução falhar, retorna o original em inglês
    }
}

async function fetchRecipes() {
    try {
        const recipes = [];
        // 3 receitas aleatórias
        for (let i = 0; i < 3; i++) {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            recipes.push(data.meals[0]);
        }
        
        displayRecipes(recipes);
    } catch (error) {
        container.innerHTML = "<p>Erro ao carregar receitas. Verifique sua conexão.</p>";
    }
}

async function displayRecipes(meals) {
    container.innerHTML = ""; // Limpa o carregando

    for (const meal of meals) {
        // Traduzindo os campos principais
        const nomeTraduzido = await traduzirTexto(meal.strMeal);
        const categoriaTraduzida = await traduzirTexto(meal.strCategory);
        const areaTraduzida = await traduzirTexto(meal.strArea);
        const instrucoesTraduzidas = await traduzirTexto(meal.strInstructions);

        // Extrair ingredientes (não traduziremos a lista longa para não travar a API, 
        // mas o modo de preparo e título sim!)
        let ingredientes = [];
        for (let i = 1; i <= 10; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredientes.push(meal[`strIngredient${i}`]);
            }
        }
            // OBS: Foi utilizada a API MyMemory para tradução. 
            // Em textos muito longos, a API pode retornar erro de limite de caracteres.
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${nomeTraduzido}">
            <div class="card-content">
                <span class="card-category">${categoriaTraduzida} | ${areaTraduzida}</span>
                <h2 class="card-title">${nomeTraduzido}</h2>
                <p class="ingredients-list"><strong>Ingredientes principais:</strong> ${ingredientes.join(', ')}</p>
                
                <button class="btn-preparo" onclick="togglePreparo(this)">Ver Modo de Preparo</button>
                
                <div class="preparo-texto">
                    <p>${instrucoesTraduzidas}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
}

function togglePreparo(btn) {
    const texto = btn.nextElementSibling;
    texto.classList.toggle('show');
    btn.innerText = texto.classList.contains('show') ? 'Ocultar Preparo' : 'Ver Modo de Preparo';
}

fetchRecipes();