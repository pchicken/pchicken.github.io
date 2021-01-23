'use strict';
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let currentSet = [];

    /*===============*\
    = TEST FORM STUFF =
    \*===============*/

const questionbox = $("question");
const answerbox = $("answer");
const resultbox = $("result");

// randomize question
function newQuestion() {
    if (currentSet.length) {
        const old = questionbox.textContent;
        while (old == questionbox.textContent) {
            questionbox.textContent = currentSet[Math.floor(Math.random()*currentSet.length)];
        }
    }
}

// register input
answerbox.addEventListener("keypress", ev => {
    if (ev.key == "Enter") {
        if (ev.target.value == questionbox.textContent) {//correct
            resultbox.textContent = "correct!";
            newQuestion(); //only move on once we've got it correct
        } else {//wrong
            resultbox.textContent = "actually, " + questionbox.textContent;
        }
        ev.target.value = "";//clear textbox
    }
});

    /*==============*\
    = TOGGLE OPTIONS =
    \*==============*/

// toggle hiding options
let optionsHidden = false;
$("toggleoptions").addEventListener("click", () => {
    optionsHidden = !optionsHidden;
    if (optionsHidden) {
        $("setselector").className = "no-border";
        $("toggleoptions").className = "full-border";
        $a(".options").forEach(el => el.style.display = "none");
    } else {
        $("setselector").className = "border";
        $("toggleoptions").className = "right-bottom-border";
        $a(".options").forEach(el => el.style.display = "");
    }
});

// populate cheatsheet
//cheatsheethider.appendChild(tableFromLetters(alphabet));


    /*===================*\
    = SET SELECTION STUFF =
    \*===================*/

//basically each tabful of sets
class SetCategory {
    constructor(title, sets, active, selected) {
        this.sets = sets;
        this.setButtons = [];

        this.selected = selected ?? false;

        //set up tab
        this.categoryTab = $("categorytab").content.querySelector("button").cloneNode(true);

        this.categoryTab.querySelector("div").textContent = title;//set title
        this.categoryTab.addEventListener("click", () => this.showPane());//click to show tab

        this.checkbox = this.categoryTab.querySelector("input");//grab checkbox
        this.checkbox.checked = selected;//set checkbox
        this.checkbox.addEventListener("click", (ev) => {
            this.selected = ev.target.checked;
            regenCurrentSet();
        });//update selected

        $("categorytabpane").appendChild(this.categoryTab);//bring to life

        //set up content 
        this.categoryContainer = $("categorycontent").content.querySelector("div").cloneNode(true);
        this.categoryContent = this.categoryContainer.querySelector("div");
        
        $("categorycontentpane").appendChild(this.categoryContainer);

        this.populateTab()

        if (active) {
            this.categoryTab.className = "active";
            this.categoryContainer.className = "active";
            this.categoryContainer.style.display = "";
        } else {
            this.categoryContainer.style.display = "none";
        }
    }

    //populate category tab contents with buttons
    populateTab() {
        for (let set of this.sets) {
            const button = new SetButton(set);
            this.setButtons.push(button);
            this.categoryContent.appendChild(button.element);
        }
    }

    showPane() {
        Array.from($("categorytabpane").getElementsByClassName("active"))
        .forEach(tab => tab.className = "");
        Array.from($("categorycontentpane").getElementsByClassName("active"))
        .forEach(con => {
            con.className = "";
            con.style.display = "none";
        });

        this.categoryTab.className = "active";
        this.categoryContainer.className = "active";
        this.categoryContainer.style.display = "";
    }
}

//the little toggleable button cards.
class SetButton {
    constructor(set) {
        this.set = set;

        this.element = $("setbutton").content.querySelector("button").cloneNode(true);
        this.element.addEventListener("click", () => {
            this.selected = !this.selected;
            regenCurrentSet();
        });

        this.checkbox = this.element.getElementsByTagName("input")[0];
        this.checkbox.addEventListener("click", (ev) => {
            this.selected = ev.target.checked;
            regenCurrentSet();
            ev.stopPropagation();
        })

        this.element.appendChild(tableFromLetters(set));
    }
    get selected() {
        return this.checkbox.checked;
    }
    set selected(v) {
        this.checkbox.checked = v;
    }
}

const letterSets = [
    "abcd", "efgh", "ijkl", "mnop", "qrst", "uvwx", "yz",
    "eimqu", "fjnrv", "gkosw", "hlptx",
    "aeiou", "eghswxyz",
];

const bigramSets = [
    ["th","he","in","en"],
    ["nt","re","er","an"],
    ["ti","es","on","at"],
    ["se","nd","or","ar"],
    ["al","te","co","de"],
    ["to","ra","et","ed"],
    ["it","sa","em","ro"],
];

const categories = [];
categories.push(new SetCategory("single letters", letterSets, true, true));
categories.push(new SetCategory("bigrams", bigramSets));
//categories.push(new SetCategory("yeah", [["LOL-GET^CLUCKD"], ["test"]]));

//assemble the global set from all the little selected set buttons
function regenCurrentSet() {
    currentSet = [];
    for (let cat of categories) {
        if (cat.selected) {
            for (let setButton of cat.setButtons) {
                console.log(setButton)
                if (setButton.selected) {
                    for (let q of setButton.set) {
                        if (!currentSet.includes(q)) {
                            currentSet.push(q);
                        }
                    }
                }
            }
        }
    }
    newQuestion();
}

// create a preview table from a list of letters
function tableFromLetters(letterList) {
    const table = document.createElement("table");
    
    const cipherRow = document.createElement("tr");
    cipherRow.className = "cipher";
    const letterRow = document.createElement("tr");
    
    for (let l of letterList) {
        let cipherCell = document.createElement("td");
        cipherCell.textContent = l;
        cipherRow.appendChild(cipherCell);
    
        let letterCell = document.createElement("td");
        letterCell.textContent = l;
        letterRow.appendChild(letterCell);
    }
    table.append(cipherRow, letterRow);
    return table;
}

function $(id) { return document.getElementById(id) }
function $a(query) { return document.querySelectorAll(query) }

regenCurrentSet();

newQuestion();