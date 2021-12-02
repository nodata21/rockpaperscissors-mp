var input = document.getElementById("input");

var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var scissors = document.getElementById("scissors");
var well = document.getElementById("well");

var output = document.getElementById("output"); var first = document.getElementById("first"); var put = document.getElementById("last");

var text = ''; var leer =", "; var cpu = '';

const beats = {'rock' : ['scissors'], 'paper': ['rock', 'well'], 'scissors': ['paper'], 'well': ['rock', 'scissors'] };

const hand = ['rock', 'paper', 'scissors', 'well'];

function play() {
    
    cpu = Math.floor(Math.random() * 4);
    input.value = text = this.id;
    
    if ( beats[text].includes(hand[cpu]) ) {
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "you Won!";
        last.style.color = "Green";
    }
    else if (hand[cpu] == text)
    {
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "it's a Draw!";
        last.style.color = "Blue";
    }
    else { 
        first.textContent = "Cpu plays " + hand[cpu] + ", you play " + text + ",\u00A0";
        last.textContent = "you Lose!";
        last.style.color = "Red";
    }
}

rock.addEventListener("click", play)
paper.addEventListener("click", play)
scissors.addEventListener("click", play)
well.addEventListener("click", play)