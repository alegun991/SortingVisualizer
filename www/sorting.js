let barHeights = [];
let states = [];
const nrOfbars = 1000;
const width_ratio = 2;

window.onload = function (){
    let canvas = document.getElementById("myCanvas");
    const maxHeight = Math.floor(canvas.height * (3/4));
    const minHeight = Math.floor(canvas.height/7);
    let selectedSortAlgo;

    randomArray(minHeight, maxHeight);
    draw(barHeights, false);
    
    document.getElementById('sort').addEventListener('change', function() {
        
        selectedSortAlgo = this.value;

    }, false);

    document.getElementById('startSort').addEventListener('click', function() {

        initSorting(selectedSortAlgo);
    });

    document.getElementById('shuffle').addEventListener('click', function() {

        shuffle(barHeights);

    });
    

}

function shuffle(arr) {

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        states[i] = -1;
    }
    draw(arr, true);
}

async function initSorting(selectedOption){

    if(selectedOption != undefined){

        switch(selectedOption){
            
            case 'bubble':
                resetStates();
                await bubbleSort(barHeights, 0, barHeights.length);

            case 'quick':
                resetStates();
                await quickSort(barHeights, 0, barHeights.length - 1);
                

            case 'merge':
                resetStates();
                await mergeSort(barHeights);

            case 'heap':
                //cal heap sort

        }
    }

}


function draw(arr, canvas_swapped){

    //TODO: take in indexes for values being compared and change color of them

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    
    if(canvas_swapped == false){
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        canvas_swapped = true;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const n = arr.length;
    const spacing = canvas.width / (width_ratio * n + n + 1);
    const bar_width = spacing * width_ratio;
    
    let x = spacing;
    for(let i = 0; i < n; i++){
        
        if(states[i] == 0){
            
            ctx.fillStyle = '#008000';
            
        }

        else if(states[i] == 1){
            
            ctx.fillStyle = '#FF0000';

        }

        else {
            
            ctx.fillStyle = 'white';
            
        }

        
        ctx.fillRect(x, 0, bar_width, arr[i]);
        ctx.stroke();
        x += spacing + bar_width;
    }

}


function randomArray(min, max){

    for(let i = 0; i < nrOfbars; i++){
        let randomValue = Math.floor(Math.random() * max) + min;
        barHeights.push(randomValue);
        states[i] = -1;
            
    }

}

async function bubbleSort(arr, start, end){

    if(start >= end){
        return;
    }

    for(let i = 0; i < end-1; i++){

        for (let j = 0; j < end - i - 1; j++){
            
            if (arr[j] > arr[j+1]){

                states[j] = 1;

                await swap(arr, j, j+1);
                states[j+1] = 0;
                draw(arr, true);
                
            }
            
            states[j] = 2;
        }

    }
}

async function quickSort(arr, left, right){

    if(left >= right){
        return;
    }

    let index = await partition(arr, left, right);
    states[index] = -1;

    if (left < index - 1) {
        await quickSort(arr, left, index - 1);

    }

    if (right > index) {
        await quickSort(arr, index, right);
       

    }

    
}

async function partition(arr, left, right) {

    for (let i = left; i < right; i++) {
        states[i] = 1;
    }
    
    let pivot_index = Math.floor((left + right) / 2);
    let pivot = arr[pivot_index];
    states[left] = 2;
    states[right] = 2;
    states[pivot_index] = 0;
  
    while (left <= right) {

      while (arr[left] < pivot) {
        left++;
        states[left] = -1;
        
      }
  
      while (arr[right] > pivot) {
        right--;
        states[right] = -1;
      }
      
      if (left <= right) {
        await swap(arr, left, right);
        left++;
        states[left] = 2;
        right--;
        states[right] = 2;

        draw(arr, true);
      }

    }
  
    return left;
}

async function mergeSort(arr){

    if(arr.length <= 1){

        return;
    }

    let middle = Math.floor(arr.length/2);
    await sleep(20);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle);

    let tmp = await merge(mergeSort(left), mergeSort(right));

    draw(tmp, true);


}

async function merge(left_half, right_half){

    let result = [];
    let left_index = 0;
    let right_index = 0;

    while(left_index < left_half.length && right_index < right_half.length){

        if(left_half[left_index] <= right_half[right_index]){

            result.push(left_half[left_index]);
            left_index++;
        }

        else{

            result.push(right_half[right_index]);
            right_index++;
        }


        return [ ...result, ...left_half, ...right_half];

    }


}

async function swap(arr, a, b){
    await sleep(10);
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;

}

function resetStates(){

    for(let i = 0; i < states.length; i++){

        states[i] = -1;
    }
}

function sleep(ms) {
    
    return new Promise(resolve => setTimeout(resolve, ms));

}