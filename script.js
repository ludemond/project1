const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const results = document.getElementById("results");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("theme-toggle");
const wordOfDayBtn = document.getElementById("word-of-day-btn");
const historyBtn = document.getElementById("history-btn");
const favoritesBtn = document.getElementById("favorites-btn");
const historyModal = document.getElementById("history-modal");
const favoritesModal = document.getElementById("favorites-modal");
const historyList = document.getElementById("history-list");
const favoritesList = document.getElementById("favorites-list");
const closeButtons = document.querySelectorAll(".close");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = input.value.trim().toLowerCase();

    if (!word) {
        showError("Please enter a word.");
        return;
    }

    if (!/^[a-zA-Z\s-]+$/.test(word)) {
        showError("Please enter a valid word (letters, spaces, and hyphens only).");
        return;
    }

    if (word.length > 50) {
        showError("Word is too long. Please enter a shorter word.");
        return;
    }

    addToHistory(word);
    fetchWord(word);
});

// Dark mode toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("darkMode", isDark);
});

// Word of the day
wordOfDayBtn.addEventListener("click", () => {
    const words = ["serendipity", "ephemeral", "quintessential", "ubiquitous", "eloquent", "resilient", "enigma", "pragmatic", "alacrity", "benevolent"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    input.value = randomWord;
    form.dispatchEvent(new Event("submit"));
});

// History modal
historyBtn.addEventListener("click", () => {
    updateHistoryList();
    historyModal.style.display = "block";
});

// Favorites modal
favoritesBtn.addEventListener("click", () => {
    updateFavoritesList();
    favoritesModal.style.display = "block";
});

// Close modals
closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        historyModal.style.display = "none";
        favoritesModal.style.display = "none";
    });
});

// Close modal on outside click
window.addEventListener("click", (e) => {
    if (e.target === historyModal) historyModal.style.display = "none";
    if (e.target === favoritesModal) favoritesModal.style.display = "none";
});

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

async function fetchWord(word) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        showLoader(true);
        results.innerHTML = "";

        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("Word not found");
            } else if (res.status >= 500) {
                throw new Error("Server error. Please try again later.");
            } else {
                throw new Error(`Error: ${res.status}`);
            }
        }

        const data = await res.json();

        if (!data || data.length === 0) {
            throw new Error("No data found for this word.");
        }

        displayData(data);

        // Update background based on word
        updateBackground(word);

        // Clear input after successful search
        input.value = "";

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            showError("Request timed out. Please try again.");
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError("Network error. Please check your internet connection and try again.");
        } else {
            showError(error.message === "Word not found"
                ? "Word not found. Try another word."
                : error.message || "An unexpected error occurred. Please try again.");
        }
    } finally {
        showLoader(false);
    }
}

function displayData(data) {
    results.innerHTML = "";

    data.forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("entry");

        // Word
        const wordHeader = document.createElement("div");
        wordHeader.style.display = "flex";
        wordHeader.style.justifyContent = "space-between";
        wordHeader.style.alignItems = "center";
        wordHeader.innerHTML = `<h2>${entry.word}</h2>`;
        
        const favBtn = document.createElement("button");
        favBtn.textContent = favorites.includes(entry.word.toLowerCase()) ? "❤️" : "🤍";
        favBtn.classList.add("fav-btn");
        favBtn.addEventListener("click", () => {
            const word = entry.word.toLowerCase();
            if (favorites.includes(word)) {
                favorites = favorites.filter(fav => fav !== word);
                favBtn.textContent = "🤍";
            } else {
                favorites.push(word);
                favBtn.textContent = "❤️";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
        
        wordHeader.appendChild(favBtn);
        div.appendChild(wordHeader);

        // Phonetic
        if (entry.phonetic) {
            div.innerHTML += `<p class="phonetic">${entry.phonetic}</p>`;
        }

        // Origin
        if (entry.origin) {
            div.innerHTML += `<p class="origin"><strong>Origin:</strong> ${entry.origin}</p>`;
        }

        // Audio pronunciation
        const audio = entry.phonetics.find(p => p.audio && p.audio.trim() !== "");
        if (audio) {
            const audioId = `audio-${entry.word}-${Math.random().toString(36).substr(2, 9)}`;
            div.innerHTML += `
                <audio id="${audioId}" src="${audio.audio}"></audio>
                <button class="audio-btn" onclick="document.getElementById('${audioId}').play()">
                    🔊 Listen
                </button>
            `;
        } else if ('speechSynthesis' in window) {
            // Fallback to TTS
            const ttsBtn = document.createElement("button");
            ttsBtn.textContent = "🗣️ Speak";
            ttsBtn.classList.add("audio-btn");
            ttsBtn.addEventListener("click", () => {
                const utterance = new SpeechSynthesisUtterance(entry.word);
                window.speechSynthesis.speak(utterance);
            });
            div.appendChild(ttsBtn);
        }

        // Meanings
        entry.meanings.forEach(meaning => {
            const meaningDiv = document.createElement("div");
            meaningDiv.classList.add("meaning");

            meaningDiv.innerHTML += `<h3>${meaning.partOfSpeech}</h3>`;

            // Definitions
            meaning.definitions.forEach((def, index) => {
                meaningDiv.innerHTML += `
                    <div class="definition">
                        <strong>Definition ${index + 1}:</strong> ${def.definition}
                        ${def.example ? `<br><em>Example:</em> "${def.example}"` : ""}
                    </div>
                `;
            });

            // Synonyms
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                meaningDiv.innerHTML += `
                    <p class="synonyms"><strong>Synonyms:</strong> ${meaning.synonyms.join(", ")}</p>
                `;
            }

            // Antonyms
            if (meaning.antonyms && meaning.antonyms.length > 0) {
                meaningDiv.innerHTML += `
                    <p class="antonyms"><strong>Antonyms:</strong> ${meaning.antonyms.join(", ")}</p>
                `;
            }

            div.appendChild(meaningDiv);
        });

        results.appendChild(div);
    });
}

function addToHistory(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.unshift(word);
        if (searchHistory.length > 10) searchHistory.pop(); // Keep only last 10
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
}

function updateHistoryList() {
    historyList.innerHTML = "";
    searchHistory.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        li.addEventListener("click", () => {
            input.value = word;
            historyModal.style.display = "none";
            form.dispatchEvent(new Event("submit"));
        });
        historyList.appendChild(li);
    });
}

function updateFavoritesList() {
    favoritesList.innerHTML = "";
    favorites.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        li.addEventListener("click", () => {
            input.value = word;
            favoritesModal.style.display = "none";
            form.dispatchEvent(new Event("submit"));
        });
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            favorites = favorites.filter(fav => fav !== word);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            updateFavoritesList();
        });
        li.appendChild(removeBtn);
        favoritesList.appendChild(li);
    });
}

function updateBackground(word) {
    const hash = word.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    const saturation = 70 + (hash % 30); // 70-100%
    const lightness = 85 + (hash % 10); // 85-95% for light mode
    
    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 5}%)`;
    
    document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    
    // For dark mode, adjust
    if (document.body.classList.contains('dark')) {
        const darkLightness = 20 + (hash % 20); // 20-40%
        const darkColor1 = `hsl(${hue}, ${saturation}%, ${darkLightness}%)`;
        const darkColor2 = `hsl(${(hue + 30) % 360}, ${saturation}%, ${darkLightness + 10}%)`;
        document.body.style.background = `linear-gradient(135deg, ${darkColor1}, ${darkColor2})`;
    }
}

function showError(msg) {
    results.innerHTML = `<p class="error">${msg}</p>`;
    // Reset background on error
    document.body.style.background = document.body.classList.contains('dark') 
        ? 'linear-gradient(135deg, #2c3e50, #34495e)' 
        : 'linear-gradient(135deg, #e0eafc, #cfdef3)';
}

function showLoader(show) {
    loader.classList.toggle("hidden", !show);
}