const callBtns=document.querySelectorAll('.btn-call');
const liftImage=document.querySelectorAll('.lift-image');
const arrivalSound=document.querySelector('#arrival-sound');

let liftStates = Array(liftImage.length).fill('idle');
let liftCurrentPositions = Array.from(liftImages)
    .map(lift => lift.getBoundingClientRect().top + window.scrollY);

callBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.classList.add('btn-waiting');
        btn.innerHTML='waiting';

    const buttonRect=btn.getBoundingClientRect();

    const btnX= buttonRect.left+window.scrollX;
    const btnY=buttonRect.top+window.screenY;

    console.log(index,btnX,btnY)
    moveLift(index,btnY,btn);
})
})


// -------------------------------------------------------move lift

function moveLift(index,positionY,btn){
const lift=liftImage[index];

lift.style.position='absolute';
lift.style.transition=' transform 4s';

const liftOriginalPosition=lift.getBoundingClientRect();
const liftPositionY=liftOriginalPosition.top+window.screenY;

if(Math.abs(liftPositionY-positionY)<5){
    console.log('lift is on that floor only');
    btn.classList.add('btn-arrived');
    btn.innerHTML='Arrived';
    arrivalSound.play();

    setTimeout(() => {
    btn.classList.add('btn-call');
    btn.innerHTML='call';
    }, 2000);

    return;
}



const translateY=positionY-liftPositionY;
lift.style.transform=`translateY(${translateY}px)`;


setTimeout(() => {
btn.classList.remove('btn-waiting');
btn.classList.add('btn-arrived');
btn.innerHTML='Arrived';
arrivalSound.play();
}, 4000);

setTimeout(()=>{
    btn.classList.remove('btn-arrived');
btn.classList.add('btn-call');
btn.innerHTML='call';
},6000)

}

