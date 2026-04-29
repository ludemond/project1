const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const results = document.getElementById("results");
const loader = document.getElementById("loader");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = input.value.trim();

    if (!word) {
        showError("Please enter a word.");
        return;
    }

    fetchWord(word);
});

async function fetchWord(word) {
    try {
        showLoader(true);
        results.innerHTML = "";

        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!res.ok) {
            throw new Error("Word not found");
        }

        const data = await res.json();
        displayData(data);

    } catch (error) {
        showError(error.message === "Word not found"
            ? "Word not found. Try another word."
            : "Network error. Try again.");
    } finally {
        showLoader(false);
    }
}

function displayData(data) {
    results.innerHTML = "";

    data.forEach(entry => {
        const div = document.createElement("div");

        // Word
        div.innerHTML += `<h2>${entry.word}</h2>`;

        // Phonetic
        if (entry.phonetic) {
            div.innerHTML += `<p class="phonetic">${entry.phonetic}</p>`;
        }

        // Audio pronunciation (Excel upgrade feature)
        const audio = entry.phonetics.find(p => p.audio);
        if (audio && audio.audio) {
            div.innerHTML += `
                <audio id="audio" src="${audio.audio}"></audio>
                <button class="audio-btn" onclick="document.getElementById('audio').play()">
                    🔊 Listen
                </button>
            `;
        }

        // Meanings
        entry.meanings.forEach(m => {
            div.innerHTML += `
                <div class="definition">
                    <strong>${m.partOfSpeech}</strong><br/>
                    ${m.definitions[0].definition}
                </div>
            `;
        });

        results.appendChild(div);
    });
}

function showError(msg) {
    results.innerHTML = `<p class="error">${msg}</p>`;
}

function showLoader(show) {
    loader.classList.toggle("hidden", !show);
}