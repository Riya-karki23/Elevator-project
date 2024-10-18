const callBtns = document.querySelectorAll(".btn-call");
const liftImages = document.querySelectorAll(".lift-image");
const arrivalSound = document.querySelector("#arrival-sound");

let liftStates = Array(liftImages.length).fill("idle");
let liftCurrentPositions = Array.from(liftImages).map(
  (lift) => lift.getBoundingClientRect().top + window.scrollY
);

callBtns.forEach((btn) => {
  if (btn.classList.contains("btn-call")) {
    btn.addEventListener("click", () => {
      if (
        btn.classList.contains("btn-waiting") ||
        btn.classList.contains("btn-arrived")
      ) {
        return;
      }
      btn.classList.add("btn-waiting");
      btn.innerHTML = "waiting";

      const buttonRect = btn.getBoundingClientRect();
      const btnY = buttonRect.top + window.scrollY;
      const btnX = buttonRect.left + window.scrollX;

      const nearestLiftIndex = findNearestAvailableLift(btnY);

      const allLiftsAtSamePosition = liftCurrentPositions.every(
        (position) => position === btnY
      );

      if (allLiftsAtSamePosition) {
        btn.classList.remove("btn-waiting");
        btn.classList.add("btn-arrived");
        btn.innerHTML = "Arrived";

        liftImages.forEach((lift) => {
          lift.classList.remove("lift-black");
          lift.classList.add("lift-green");
        });

        setTimeout(() => {
          btn.classList.remove("btn-arrived");
          btn.classList.add("btn-call");
          btn.innerHTML = "call";

          liftImages.forEach((lift) => {
            lift.classList.remove("lift-green");
            lift.classList.add("lift-black");
          });
        }, 2000);
        console.log("All lifts are already at the final position");
      } 

      else if (nearestLiftIndex !== -1 ) {
        moveLift(nearestLiftIndex, btnY, btn, btnX);
      } 
      
      else {
        console.log("All lifts are currently busy");
        btn.innerHTML = "waiting";
        AvailableLift(btnY, btn);
      }
    });
  }
});

function findNearestAvailableLift(targetY) {
  let nearestLiftIndex = -1;
  let shortestDistance = Infinity;

  liftCurrentPositions.forEach((liftY, index) => {
    if (liftStates[index] === "idle" && liftY !== targetY) {
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
  lift.style.position = "absolute";
  lift.classList.remove("lift-black");
  lift.classList.add("lift-red");

  const currentLiftY = liftCurrentPositions[liftIndex];
  const distance = Math.abs(targetY - currentLiftY);

  // ------------------------------------------------------------time calculated for the lift to reach
  const speed = 80;
  const arrivalTime = (distance / speed) * 1000;

  let totalSeconds = Math.floor(arrivalTime / 1000);

  const liftRect = lift.getBoundingClientRect();
  const liftX = liftRect.left + window.scrollX;
  const messageElement = displayMessage("", liftX, targetY);

  if (totalSeconds <= 1) {
    messageElement.textContent = `0 min 1 sec`;
    console.log("1 second");

    setTimeout(() => {
      messageElement.remove();
      btn.classList.remove("btn-waiting");
      btn.classList.add("btn-arrived");
      btn.innerHTML = "Arrived";
      lift.classList.remove("lift-red");
      lift.classList.add("lift-green");
      arrivalSound.play();
    }, arrivalTime+2000);
  } else {
    const countdown = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(countdown);
        console.log("Lift arrived");
        return;
      }

      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;

      messageElement.textContent = `${minutes} mins ${seconds} sec `;
      console.log(`${totalSeconds} seconds remaining`);

      totalSeconds--;
    }, 1000);
  }

  lift.style.top = `${currentLiftY}px`;
  lift.style.transition = `top ${arrivalTime / 1000}s `;

  setTimeout(() => {
    lift.style.top = `${targetY}px`;
  }, 2000);

  liftCurrentPositions[liftIndex] = targetY;
  liftStates[liftIndex] = "moving";

  setTimeout(() => {
    btn.classList.remove("btn-waiting");
    btn.classList.add("btn-arrived");
    btn.innerHTML = "Arrived";
    lift.classList.remove("lift-red");
    lift.classList.add("lift-green");
    arrivalSound.play();
    messageElement.remove();
  }, arrivalTime + 1500);

  setTimeout(() => {
    resetButtonAndLift(liftIndex, btn);
  }, arrivalTime + 2000 + 200);
}


function displayMessage(text, liftX, targetY) {
  const messageElement = document.createElement("div");
  messageElement.textContent = text;

  messageElement.style.position = "absolute";
  messageElement.style.top = `${targetY}px`;
  messageElement.style.left = `${liftX}px`;
  messageElement.style.transform = "translateX(-35%)";
  messageElement.style.color = "black";
  messageElement.style.padding = "5px 10px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.zIndex = "1000";
  messageElement.style.whiteSpace = "nowrap";

  document.body.appendChild(messageElement);

  return messageElement;
}

function resetButtonAndLift(liftIndex, btn) {
  setTimeout(() => {
    btn.classList.remove("btn-arrived");
    btn.classList.add("btn-call");
    btn.innerHTML = "call";

    const lift = liftImages[liftIndex];
    lift.classList.remove("lift-green");
    lift.classList.add("lift-black");

    setTimeout(() => {
      liftStates[liftIndex] = "idle";
    }, 2000);
  }, 2000);
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
