const callBtns=document.querySelectorAll('.btn-call');
const liftImage=document.querySelectorAll('.lift-image');
const arrivalSound=document.querySelector('#arrival-sound');


callBtns.forEach((btn,index)=>{
btn.addEventListener("click",()=>{

        btn.classList.add('btn-waiting');
        liftImage[index].classList.add('icon-red')

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
    btn.classList.remove('btn-waiting')
    btn.classList.add('btn-arrived');
    btn.innerHTML='Arrived';
    lift.classList.remove('icon-black')
    lift.classList.add('icon-green')
    arrivalSound.play();

    setTimeout(() => {
    btn.classList.remove('btn-arrived')
    btn.classList.add('btn-call');
    btn.innerHTML='call';
    lift.classList.add('icon-black')
    }, 2000);

    return;
}



const translateY=positionY-liftPositionY;
lift.style.transform=`translateY(${translateY}px)`;


setTimeout(() => {
btn.classList.remove('btn-waiting');
btn.classList.add('btn-arrived');
lift.classList.add('icon-green')
btn.innerHTML='Arrived';
arrivalSound.play();
}, 4000);

setTimeout(()=>{
    btn.classList.remove('btn-arrived');
btn.classList.add('btn-call');
lift.classList.add('icon-black')
btn.innerHTML='call';
},6000)

}

