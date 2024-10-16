const callBtns = document.querySelectorAll('.btn-call');
const liftImages = document.querySelectorAll('.lift-image');
const arrivalSound = document.querySelector('#arrival-sound');

// Track the current state and positions of each lift
let liftStates = Array(liftImages.length).fill('idle');
let liftCurrentPositions = Array.from(liftImages).map(lift => lift.getBoundingClientRect().top);

// Attach event listeners to the buttons
callBtns.forEach((btn, floorIndex) => {
    btn.addEventListener("click", () => {
        btn.classList.add('btn-waiting');
        btn.innerHTML = 'waiting';

        // Get the button's Y position on the page
        const buttonRect = btn.getBoundingClientRect();
        const btnY = buttonRect.top + window.scrollY;

        // Find an available lift (idle lift)
        const availableLiftIndex = findAvailableLift();

        if (availableLiftIndex !== -1) {
            moveLift(availableLiftIndex, btnY, btn);
        } else {
            console.log('All lifts are currently busy');
            btn.innerHTML = 'Busy';
        }
    });
});

// Function to find the first available lift
function findAvailableLift() {
    return liftStates.indexOf('idle');
}

// Function to move the lift to the Y position of the button
function moveLift(liftIndex, targetY, btn) {
    const lift = liftImages[liftIndex];
    lift.style.position = 'absolute'; // Ensure absolute positioning
    lift.style.transition = 'top 4s'; // Smooth transition

    // Get the lift's current Y position
    const currentLiftY = liftCurrentPositions[liftIndex];

    // Calculate the lift movement based on the button's Y position
    const translateY = targetY - currentLiftY;

    // Move the lift by updating its top property
    lift.style.top = ${targetY}px;

    // Update the lift's current position
    liftCurrentPositions[liftIndex] = targetY;

    liftStates[liftIndex] = 'moving'; // Mark the lift as busy

    // Wait for the lift to arrive
    setTimeout(() => {
        btn.classList.remove('btn-waiting');
        btn.classList.add('btn-arrived');
        btn.innerHTML = 'Arrived';
        arrivalSound.play(); // Play arrival sound
    }, 4000);

    // Reset the button and lift state after some time
    setTimeout(() => {
        resetButtonAndLift(liftIndex, btn);
    }, 6000);
}

// Reset the button and lift state after the lift has moved
function resetButtonAndLift(liftIndex, btn) {
    btn.classList.remove('btn-arrived');
    btn.classList.add('btn-call');
    btn.innerHTML = 'call';
    liftStates[liftIndex] = 'idle'; // Mark the lift as idle
}
