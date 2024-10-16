const callBtns = document.querySelectorAll('.btn-call');
const liftImages = document.querySelectorAll('.lift-image');
const arrivalSound = document.querySelector('#arrival-sound');

let liftStates = Array(liftImages.length).fill('idle');
let liftCurrentPositions = Array.from(liftImages)
    .map(lift => lift.getBoundingClientRect().top + window.scrollY);

callBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.classList.add('btn-waiting');
        btn.innerHTML = 'waiting';

        const buttonRect = btn.getBoundingClientRect();
        const btnY = buttonRect.top + window.scrollY;

        const nearestLiftIndex = findNearestAvailableLift(btnY);

        if (nearestLiftIndex !== -1) {
            moveLift(nearestLiftIndex, btnY, btn);
        } else {
            console.log('All lifts are currently busy');
            btn.innerHTML = 'waiting';
            AvailableLift(btnY, btn);
        }
    });
});

function findNearestAvailableLift(targetY) {
    let nearestLiftIndex = -1;
    let shortestDistance = Infinity;

    liftCurrentPositions.forEach((liftY, index) => {
        if (liftStates[index] === 'idle' && liftY !== targetY) {
            const distance = Math.abs(targetY - liftY);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestLiftIndex = index;
            }
        }
    });

    return nearestLiftIndex;
}

function moveLift(liftIndex, targetY, btn) {
    const lift = liftImages[liftIndex];
    lift.style.position = 'absolute';
    lift.classList.remove('lift-black');
    lift.classList.add('lift-red');

    const currentLiftY = liftCurrentPositions[liftIndex];
    const distance = Math.abs(targetY - currentLiftY);

    const speed = 100; 
    const arrivalTime = (distance / speed) * 1000; 

    lift.style.top = `${currentLiftY}px`;
    lift.style.transition = `top ${arrivalTime / 1000}s ease`;

    setTimeout(() => {
        lift.style.top = `${targetY}px`; 
    }, 0);

    liftCurrentPositions[liftIndex] = targetY;
    liftStates[liftIndex] = 'moving'; 

    setTimeout(() => {
        btn.classList.remove('btn-waiting');
        btn.classList.add('btn-arrived');
        btn.innerHTML = 'Arrived';
        lift.classList.remove('lift-red');
        lift.classList.add('lift-green');
        arrivalSound.play(); 
    }, arrivalTime);

    setTimeout(() => {
        resetButtonAndLift(liftIndex, btn); 
    }, arrivalTime + 1500); 
}

function resetButtonAndLift(liftIndex, btn) {
    // Reset button
    btn.classList.remove('btn-arrived');
    btn.classList.add('btn-call');
    btn.innerHTML = 'call';

    const lift = liftImages[liftIndex];
    lift.classList.remove('lift-green');
    lift.classList.add('lift-black');
    liftStates[liftIndex] = 'idle'; 
}

function AvailableLift(targetY, btn) {
    const pollingInterval = setInterval(() => {
        const nearestLiftIndex = findNearestAvailableLift(targetY);

        if (nearestLiftIndex !== -1) {
            clearInterval(pollingInterval); 
            moveLift(nearestLiftIndex, targetY, btn); 
        }
    }, 1000); 
}
