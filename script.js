const envelopeWrapper = document.querySelector('.envelope-wrapper');
const startButton = document.getElementById('startButton');

// pasirinktas vardas (iš kortelių)
let selectedName = null;

envelopeWrapper.addEventListener('click', () => {
    envelopeWrapper.classList.add('flap');

    setTimeout(() => {
        startButton.classList.remove('start-hidden');
    }, 600);
});

// Paspaudus "Pradėti traukimą"
function setupStartScreen() {
    const letterTextBlock = document.querySelector('.letter-text-block');
    const formBlock = document.getElementById('formBlock');

    startButton.addEventListener('click', (event) => {
        event.stopPropagation();
        letterTextBlock.classList.add('hidden');
        formBlock.classList.remove('hidden');
        startButton.classList.add('hidden');
    });
}

/**
 * Užkrauna visus dalyvių vardus iš pairs.json
 * Tikimasi, kad pairs.json struktūra:
 * {
 *   "Vaiva": { "code": "1111", "target": "Jonas" },
 *   "Jonas": { "code": "2222", "target": "Ona" }
 * }
 */
async function loadParticipants() {
    try {
        const res = await fetch("./pairs.json");
        if (!res.ok) {
            throw new Error("Nepavyko nuskaityti pairs.json");
        }

        const pairs = await res.json();
        const names = Object.keys(pairs);

        const grid = document.getElementById("nameGrid");
        grid.innerHTML = "";

        names.forEach(name => {
            const card = document.createElement("div");
            card.classList.add("name-card");
            card.textContent = name;

            card.addEventListener("click", () => {
                document.querySelectorAll(".name-card")
                    .forEach(c => c.classList.remove("selected"));

                card.classList.add("selected");
                selectedName = name;
            });

            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        const grid = document.getElementById("nameGrid");
        grid.innerHTML = "<p>Nepavyko užkrauti dalyvių sąrašo.</p>";
    }
}

// Mygtukas „Sužinoti, kam dovanosiu“ – logika iš pairs.json
async function setupButton() {
    const button = document.getElementById("checkButton");
    const codeInput = document.getElementById("codeInput");
    const result = document.getElementById("result");

    button.addEventListener("click", async () => {
        const name = selectedName;
        const code = codeInput.value.trim();

        if (!name || !code) {
            result.textContent = "Pasirink vardą ir įvesk kodą.";
            return;
        }

        try {
            const res = await fetch("./pairs.json");
            if (!res.ok) {
                throw new Error("Nepavyko nuskaityti pairs.json");
            }

            const pairs = await res.json();
            const entry = pairs[name];

            if (!entry) {
                result.textContent = "Toks dalyvis nerastas.";
                return;
            }

            if (entry.code !== code) {
                result.textContent = "Neteisingas kodas.";
                return;
            }

            result.textContent = "Tavo dovana bus skirta: " + entry.target;
        } catch (err) {
            console.error(err);
            result.textContent = "Nepavyko nuskaityti duomenų failo.";
        }
    });
}

// SNIEGO ANIMACIJA
const snowContainer = document.querySelector('.snow');

function createSnowflakeDot() {
    const dot = document.createElement('div');
    dot.classList.add('snowflake-dot');

    dot.style.left = Math.random() * 100 + "vw";
    const duration = Math.random() * 5 + 5;
    dot.style.animationDuration = duration + "s";

    const size = Math.random() * 4 + 2;
    dot.style.width = size + "px";
    dot.style.height = size + "px";

    snowContainer.appendChild(dot);

    setTimeout(() => {
        dot.remove();
    }, duration * 1000);
}

setInterval(createSnowflakeDot, 120);

// Paleidžiam viską
setupStartScreen();
loadParticipants();
setupButton();
