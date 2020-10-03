const canvas = document.getElementById('myCanvas');
const dropDownList = document.getElementById('sort');
const sortButton = document.getElementById('startSort');
const shuffleButton = document.getElementById('shuffle');

const maxHeight = Math.floor(canvas.height * (3/4));
const minHeight = Math.floor(canvas.height/7);
let barHeights = [];
let states = [];
const nrOfbars = 300;
const width_ratio = 2;
let selectedSortAlgo;
let isCompleted = false;

initCanvas();

function initCanvas() {
    
    randomArray(minHeight, maxHeight);
    draw(barHeights, false);
    
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

        console.log('selected', selectedOption);

        switch(selectedOption) {
            
            case 'bubble': {
                resetStates();
                const arr = await bubbleSort(barHeights, 0, barHeights.length);
                isCompleted = true;
                sortingCompleted(arr);
                break;
            }
                
            case 'quick': {
                resetStates();
                const arr = await quickSort(barHeights, 0, barHeights.length - 1);
                isCompleted = true;
                sortingCompleted(arr);
                break;
            }
                  
            case 'merge': {
                resetStates();
                await mergeSort(barHeights, 0, barHeights.length);
                break;
            }
                
            case 'heap': {
                //cal heap sort
                break;
            }      

        }
    }
}


function draw(arr, canvas_swapped){

    const ctx = canvas.getContext("2d");

    if(canvas_swapped == false){
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        canvas_swapped = true;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(arr !== undefined) {
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
}


function randomArray(min, max){

    for(let i = 0; i < nrOfbars; i++){
        let randomValue = Math.floor(Math.random() * max) + min;
        barHeights.push(randomValue);
        states[i] = -1;
            
    }

}

async function sortingCompleted(arr) {
    if(isCompleted) {

        for(let i = 0; i < arr.length; i++) {
            states[i] = 0;
            draw(arr, true);
            await sleep(7);
        }

        isCompleted = false;
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
    
    return arr;
}

async function quickSort(arr, left, right) {

    if(left >= right) {
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

    return arr;
    
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

async function mergeSort(arr, lo, hi) {
    
    if(hi - lo > 1){
        await sleep(5);
        let middle = Math.floor((lo + hi) / 2);

        await mergeSort(arr, lo, middle);
        await mergeSort(arr, middle, hi);
        await merge(arr, lo, middle, hi);
        
    }

}

async function merge(arr, lo, mid, hi) {

    let tmp = [];
    let left_length = mid - lo;
    let i, j, k;

    for(let i = 0; i < left_length; i++) {
        tmp[i] = arr[lo + i];
        draw(arr, true);
    }

    i = 0;
    j = mid;
    k = lo;

    while(i < left_length && j < hi){

        if(tmp[i] <= arr[j]){
            await sleep(5);
            arr[k++] = tmp[i++];
            draw(arr, true);
        }

        else{
            await sleep(5);
            arr[k++] = arr[j++];
            draw(arr, true);
        }

    }

    while (i < left_length) {
        await sleep(5);
        arr[k++] = tmp[i++];
        draw(arr, true);
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

dropDownList.addEventListener('change', function() {
    selectedSortAlgo = '';
    selectedSortAlgo = this.value;
    console.log(selectedSortAlgo);

}, true);

sortButton.addEventListener('click', function() {
    console.log('button listener sort', selectedSortAlgo);
    initSorting(selectedSortAlgo);
});

shuffleButton.addEventListener('click', function() {

    shuffle(barHeights);

});