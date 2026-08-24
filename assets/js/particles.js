// =====================================================
// CANVAS
// =====================================================
// =====================================================
// INTERNAL RESOLUTION
// =====================================================

// =====================================================
// PARTICLE SETTINGS
// =====================================================

const PARTICLE_COUNT = 180;

const particles = [];



const particleHero = document.querySelector(".hero");
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let WIDTH;
let HEIGHT;

function resizeCanvas() {
    const rect = particleHero.getBoundingClientRect();

    WIDTH = rect.width;
    HEIGHT = rect.height;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);
// =====================================================
// MOUSE
// =====================================================

const mouse = {

    x: -1000,
    y: -1000,

    radius: 180

};


// =====================================================
// MOUSE POSITION
// =====================================================

particleHero.addEventListener("mousemove", (event) => {

    const rect =
        particleHero.getBoundingClientRect();


    mouse.x =
        (event.clientX - rect.left)
        * WIDTH / rect.width;


    mouse.y =
        (event.clientY - rect.top)
        * HEIGHT / rect.height;

});


particleHero.addEventListener("mouseleave", () => {

    mouse.x = -1000;
    mouse.y = -1000;

});


// =====================================================
// PARTICLE
// =====================================================

class Particle {

    constructor() {

        // -------------------------------------------------
        // POSITION
        // -------------------------------------------------

        this.x =
            Math.random() * WIDTH;

        this.y =
            Math.random() * HEIGHT;


        // Початкова позиція по Y.
        // Від неї будується траєкторія.

        this.originY =
            this.y;


        // -------------------------------------------------
        // SIZE
        // -------------------------------------------------

        this.size =
            Math.random() * 2.2 + 0.7;

        this.baseSize =
            this.size;


        // -------------------------------------------------
        // FLOW SPEED
        // -------------------------------------------------

        // Дуже повільний рух зліва направо.

        this.speed =
            Math.random() * 0.10 + 0.08;


        // -------------------------------------------------
        // WAVE
        // -------------------------------------------------

        // Висота хвилі.

        this.amplitude =
            Math.random() * 35 + 15;


        // Довжина хвилі.

        this.frequency =
            Math.random() * 0.004 + 0.002;


        // Кожна частинка починає хвилю
        // з іншого місця.

        this.phase =
            Math.random() *
            Math.PI *
            2;


        // -------------------------------------------------
        // SECONDARY WAVE
        // -------------------------------------------------

        this.secondaryAmplitude =
            Math.random() * 12 + 5;


        this.secondaryFrequency =
            Math.random() * 0.008 + 0.004;


        // -------------------------------------------------
        // TWINKLE
        // -------------------------------------------------

        this.twinkle =
            Math.random() *
            Math.PI *
            2;


        this.twinkleSpeed =
            Math.random() *
            0.02 +
            0.008;


        // -------------------------------------------------
        // ALPHA
        // -------------------------------------------------

        this.baseAlpha =
            Math.random() *
            0.45 +
            0.30;

    }


    // =====================================================
    // UPDATE
    // =====================================================

    update(time) {

        // -------------------------------------------------
        // 1. MOVE FORWARD
        // -------------------------------------------------

        this.x += this.speed;


        // -------------------------------------------------
        // 2. MAIN WAVE
        // -------------------------------------------------

        const mainWave =
            Math.sin(
                this.x *
                this.frequency
                +
                this.phase
                +
                time
            );


        // -------------------------------------------------
        // 3. SECONDARY WAVE
        // -------------------------------------------------

        const secondaryWave =
            Math.sin(
                this.x *
                this.secondaryFrequency
                +
                this.phase *
                1.7
                +
                time *
                0.7
            );


        // -------------------------------------------------
        // 4. CALCULATE POSITION
        // -------------------------------------------------

        this.y =
            this.originY

            +

            mainWave *
            this.amplitude

            +

            secondaryWave *
            this.secondaryAmplitude;


        // -------------------------------------------------
        // 5. TWINKLE
        // -------------------------------------------------

        this.twinkle +=
            this.twinkleSpeed;


        const twinkleValue =
            Math.sin(
                this.twinkle
            );


        this.alpha =
            this.baseAlpha
            +
            twinkleValue * 0.12;


        // -------------------------------------------------
        // 6. MOUSE
        // -------------------------------------------------

        const dx =
            this.x -
            mouse.x;


        const dy =
            this.y -
            mouse.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance < mouse.radius &&
            distance > 0
        ) {

            const force =
                (mouse.radius - distance)
                / mouse.radius;


            // Відштовхуємо частинку
            // від курсора.

            this.x +=
                (dx / distance)
                *
                force
                *
                2;


            this.y +=
                (dy / distance)
                *
                force
                *
                2;


            // Частинка стає яскравішою.

            this.size =
                this.baseSize
                +
                force * 2.5;

        }
        else {

            this.size =
                this.baseSize;

        }


        // -------------------------------------------------
        // 7. LOOP
        // -------------------------------------------------

        if (
            this.x >
            WIDTH + 50
        ) {

            this.x = -50;


            // Нова випадкова висота.

            this.originY =
                Math.random() *
                HEIGHT;


            // Нова фаза.

            this.phase =
                Math.random() *
                Math.PI *
                2;

        }

    }


    // =====================================================
    // DRAW
    // =====================================================

    draw() {

        // -------------------------------------------------
        // GLOW
        // -------------------------------------------------

        const glowRadius =
            this.size * 8;


        const glow =
            ctx.createRadialGradient(

                this.x,
                this.y,
                0,

                this.x,
                this.y,
                glowRadius

            );


        // Центр.

        glow.addColorStop(
            0,
            `rgba(
                65,
                240,
                225,
                ${this.alpha}
            )`
        );


        // Середина.

        glow.addColorStop(
            0.30,
            `rgba(
                20,
                190,
                220,
                ${this.alpha * 0.45}
            )`
        );


        // Край.

        glow.addColorStop(
            1,
            "rgba(0, 0, 0, 0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.arc(
            this.x,
            this.y,
            glowRadius,
            0,
            Math.PI * 2
        );


        ctx.fill();


        // -------------------------------------------------
        // CORE
        // -------------------------------------------------

        ctx.beginPath();


        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            `rgba(
                90,
                255,
                235,
                ${this.alpha}
            )`;


        ctx.fill();

    }

}


// =====================================================
// CREATE PARTICLES
// =====================================================

for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
) {

    particles.push(
        new Particle()
    );

}


// =====================================================
// ANIMATION
// =====================================================

function animate() {

    // -------------------------------------------------
    // TIME
    // -------------------------------------------------

    const time =
        performance.now() *
        0.00015;


    // -------------------------------------------------
    // CLEAR
    // -------------------------------------------------

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // -------------------------------------------------
    // PARTICLES
    // -------------------------------------------------

    for (
        const particle
        of particles
    ) {

        particle.update(time);

        particle.draw();

    }


    // -------------------------------------------------
    // NEXT FRAME
    // -------------------------------------------------

    requestAnimationFrame(
        animate
    );

}


// =====================================================
// START
// =====================================================

animate();