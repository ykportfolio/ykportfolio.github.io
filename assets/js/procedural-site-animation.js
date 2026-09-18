const leaf = document.querySelector("#leaf");
const printLayer = document.querySelector("#print-layer");
const nozzle = document.querySelector("#nozzle");

if (!leaf) {
    console.error("ERROR: #leaf not found!");
}
if (!printLayer) {
    console.error("ERROR: #print-layer not found!");
}
if (!nozzle) {
    console.error("ERROR: #nozzle not found!");
}

const minX = 80;
const maxX = 510;
const minY = 60;
const maxY = 480;
const rowSpacing = 7;
const scanStep = 2;
const printSpeed = 3;

function isInsideLeaf(x, y) {

    return leaf.isPointInFill(
        new DOMPoint(x, y)
    );

}

function findSegments(y) {

    const segments = [];
    let inside = false;
    let startX = null;

    
    for (
        let x = minX;
        x <= maxX;
        x += scanStep
    ) {

        const insideNow =
            isInsideLeaf(x, y);
      
        if (insideNow && !inside) {

            startX = x;

            inside = true;

        }

        if (!insideNow && inside) {

            segments.push({

                x1: startX,

                x2: x,

                y: y

            });


            inside = false;

            startX = null;

        }

    }

    if (
        inside &&
        startX !== null
    ) {

        segments.push({

            x1: startX,

            x2: maxX,

            y: y

        });

    }


    return segments;

}

const segments = [];
let directionRight = true;

for (
    let y = maxY;
    y >= minY;
    y -= rowSpacing
) {

    const rowSegments =
        findSegments(y);

    rowSegments.forEach(segment => {

        if (directionRight) {

            segment.start =
                segment.x1;

            segment.end =
                segment.x2;

        }

        else {

            segment.start =
                segment.x2;

            segment.end =
                segment.x1;

        }

        segment.direction =
            directionRight ? 1 : -1;


        segment.length =
            Math.abs(
                segment.end -
                segment.start
            );

        const printPath =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        printPath.setAttribute(
            "class",
            "print-line"
        );

        printPath.setAttribute(
            "d",
            `M ${segment.start} ${segment.y}
             L ${segment.end} ${segment.y}`
        );

        printPath.style.strokeDasharray =
            segment.length;

        printPath.style.strokeDashoffset =
            segment.length;

        segment.path =
            printPath;

        printLayer.appendChild(
            printPath
        );

        segments.push(
            segment
        );

    });

    directionRight =
        !directionRight;

}

function moveNozzle(
    x,
    y,
    direction
) {

    nozzle.setAttribute(
        "transform",
        `
        translate(${x} ${y})
        scale(${direction} 1)
        `
    );

}

function animateSegment(
    segment,
    onComplete
) {


    const segmentLength =
        segment.length;


    let progress = 0;


    const direction =
        segment.direction;

    function draw() {

        progress += printSpeed;

        if (
            progress >
            segmentLength
        ) {

            progress =
                segmentLength;

        }

        segment.path.style.strokeDashoffset =
            segmentLength - progress;

        const nozzleX =
            segment.start +
            progress * direction;

        moveNozzle(
            nozzleX,
            segment.y,
            direction
        );

        if (
            progress <
            segmentLength
        ) {

            requestAnimationFrame(
                draw
            );

        }

        else {

            onComplete();

        }

    }

    draw();

}


let currentSegment = 0;


function printNext() {


    if (
        currentSegment >=
        segments.length
    ) {

        finishPrint();

        return;

    }

    const segment =
        segments[currentSegment];


    moveNozzle(
        segment.start,
        segment.y,
        segment.direction
    );

    animateSegment(
        segment,

        () => {

            currentSegment++;

            printNext();

        }
    );

}

function finishPrint() {

    console.log(
        "Leaf printed!"
    );

}

printNext();