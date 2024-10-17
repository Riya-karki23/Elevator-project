const callBtns = document.querySelectorAll('.btn-call');
const liftImages = document.querySelectorAll('.lift-image');
const arrivalSound = document.querySelector('#arrival-sound');

let liftStates = Array(liftImages.length).fill('idle');
let liftCurrentPositions = Array.from(liftImages)
    .map(lift => lift.getBoundingClientRect().top + window.scrollY);

callBtns.forEach((btn) => {
    if (btn.classList.contains('btn-call')) {
        btn.addEventListener("click", () => {
            if(btn.classList.contains('btn-waiting') || btn.classList.contains('btn-arrived') ){
                return;
            }
            btn.classList.add('btn-waiting');
            btn.innerHTML = 'waiting';

            const buttonRect = btn.getBoundingClientRect();
            const btnY = buttonRect.top + window.scrollY;
            const btnX = buttonRect.left + window.scrollX; // Get X position of the button

            const nearestLiftIndex = findNearestAvailableLift(btnY);

            if (nearestLiftIndex !== -1) {
                moveLift(nearestLiftIndex, btnY, btn, btnX); // Pass btnX to moveLift
            } else {
                console.log('All lifts are currently busy');
                btn.innerHTML = 'waiting';
                AvailableLift(btnY, btn);
                
            }
        });
    }
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

    // ------------------------------------------------------------time calculated for the lift to reach

    const speed = 40; 
    const arrivalTime = (distance / speed) * 1000; 
    
    let totalSeconds = Math.floor(arrivalTime / 1000);
    
    const minutes = Math.floor(totalSeconds / 60);
    
    const liftRect = lift.getBoundingClientRect();
    const liftX = liftRect.left + window.scrollX; 
    const messageElement = displayMessage('', liftX, targetY);

    const countdown = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdown);
            console.log('lift arrived');
            return;
        }
        
        totalSeconds--;
        messageElement.textContent = `${minutes} mins ${totalSeconds} sec `;
        console.log(`${totalSeconds} seconds remaining`);
    }, 1000);
  

    lift.style.top = `${currentLiftY}px`;
    lift.style.transition = `top ${arrivalTime / 1000}s `;


    setTimeout(() => {
        lift.style.top = `${targetY}px`; 
    }, 300);

    liftCurrentPositions[liftIndex] = targetY;
    liftStates[liftIndex] = 'moving'; 

    setTimeout(() => {
        btn.classList.remove('btn-waiting');
        btn.classList.add('btn-arrived');
        btn.innerHTML = 'Arrived';
        lift.classList.remove('lift-red');
        lift.classList.add('lift-green');
        arrivalSound.play(); 
        messageElement.remove();

        // ------------------------------time removed after lift arrived
    }, arrivalTime-800);

    setTimeout(() => {
        resetButtonAndLift(liftIndex, btn); 
    }, arrivalTime + 200); 
}

function displayMessage(text,liftX, targetY) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;

    messageElement.style.position = 'absolute';
    messageElement.style.top = `${targetY}px`;
    messageElement.style.left = `${liftX}px`; 
    messageElement.style.transform = 'translateX(-35%)'; 
    messageElement.style.color = 'black';
    messageElement.style.padding = '5px 10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000'; 
    messageElement.style.whiteSpace = 'nowrap'; 

    document.body.appendChild(messageElement);

    return messageElement;
}

function resetButtonAndLift(liftIndex, btn) {
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
