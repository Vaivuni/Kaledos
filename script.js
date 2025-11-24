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

// Užkrauti vardus iš serverio
async function loadParticipants() {
    const res = await fetch("/api/participants");
    const names = await res.json();

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
}

// Mygtukas „Sužinoti, kam dovanosiu“
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
            const res = await fetch("/api/get-target", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, code })
            });

            const data = await res.json();

            if (!res.ok) {
                result.textContent = data.error || "Įvyko klaida.";
                return;
            }

            result.textContent = "Tavo dovana bus skirta: " + data.target;
        } catch (err) {
            result.textContent = "Serverio klaida. Ar jis paleistas?";
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
