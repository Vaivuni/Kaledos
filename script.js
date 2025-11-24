const envelopeWrapper = document.querySelector('.envelope-wrapper');
const startButton = document.getElementById('startButton');

// pasirinktas vardas (iš kortelių)
let selectedName = null;

// Voko animacija
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

// 🔹 Užkrauti vardus tiesiai iš pairs.json
async function loadParticipants() {
    try {
        const res = await fetch("./pairs.json");
        const pairs = await res.json();

        const names = Object.keys(pairs);
        const grid = document.getElementById("nameGrid");

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
        document.getElementById("nameGrid").textContent =
            "Nepavyko užkrauti dalyvių.";
    }
}

// 🔹 Mygtukas – tiesiog rodom porą
function setupButton() {
    const button = document.getElementById("checkButton");
    const result = document.getElementById("result");

    button.addEventListener("click", async () => {
        if (!selectedName) {
            result.textContent = "Pasirink savo vardą.";
            return;
        }

        const res = await fetch("./pairs.json");
        const pairs = await res.json();

        const target = pairs[selectedName];

        if (!target) {
            result.textContent = "Šiam vardui pora nerasta.";
            return;
        }

        result.textContent = "Tu dovanosi: " + target;
    });
}

// ❄️ SNIEGAS
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
