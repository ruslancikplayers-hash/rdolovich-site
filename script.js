const music = document.getElementById("music");
const musicButton = document.querySelector(".music-button");

let musicEnabled = false;

window.addEventListener("load", async () => {
    try{
        await music.play();

        musicEnabled = true;
        musicButton.classList.remove("muted");

    } catch (error) {

        console.log("Автозапуск музыки заблокирован браузером");
    }
});

musicButton.addEventListener("click", async () => {

    try {

        if (musicEnabled) {

            music.pause();
            musicButton.classList.add("muted");

            musicEnabled = false;

        } else {

            await music.play();

            musicButton.classList.remove("muted");

            musicEnabled = true;
        }

    } catch (error) {

        console.error("Не удалось запустить музыку:", error);

    }

});


const cursorGlow =
    document.querySelector(".cursor-glow");

if (cursorGlow) {

    let cursorX = 0;
    let cursorY = 0;

    let glowX = 0;
    let glowY = 0;

    document.addEventListener("mousemove", (event) => {

        cursorX = event.clientX;
        cursorY = event.clientY;

    });

    function animateCursor() {

        glowX += (cursorX - glowX) * 0.12;
        glowY += (cursorY - glowY) * 0.12;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(
            animateCursor
        );
    }

    animateCursor();
}

const backgroundVideo =
    document.querySelector(".background-video");

if (backgroundVideo) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (event) => {

        targetX =
            (event.clientX / window.innerWidth - 0.5) * 2;

        targetY =
            (event.clientY / window.innerHeight - 0.5) * 2;

    });

    function animateParallax() {

        currentX +=
            (targetX - currentX) * 0.04;

        currentY +=
            (targetY - currentY) * 0.04;

        backgroundVideo.style.transform =
            `scale(1.06)
             translate3d(
                ${currentX * 12}px,
                ${currentY * 8}px,
                0
             )`;

        requestAnimationFrame(
            animateParallax
        );
    }

    animateParallax();
}

const viewsElement = document.getElementById("views");

if (viewsElement) {

    fetch("/api/views", {
        method: "GET",
        cache: "no-store"
    })
        .then((response) => {

            if (!response.ok) {
                throw new Error("Ошибка загрузки просмотров");
            }

            return response.json();
        })
        .then((data) => {

            viewsElement.textContent =
                Number(data.views).toLocaleString("ru-RU");

        })
        .catch((error) => {

            console.error(
                "Не удалось загрузить просмотры:",
                error
            );

        });
}