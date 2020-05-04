interface IQuestion {
    question: string;
    result: string;
    answer: string;
    time: number;
    penalty: number;
};

interface IQuestions extends Array<IQuestion> { };

let jsonQuestions: string = `[
    {"question":"2 + 2 = ", "result":"4", "answer":"", "time":0, "penalty":2},
    {"question":"2 + 3 = ", "result":"5", "answer":"", "time":0, "penalty":3},
    {"question":"2 + 4 = ", "result":"6", "answer":"", "time":0, "penalty":4},
    {"question":"2 + 5 = ", "result":"7", "answer":"", "time":0, "penalty":5}
]`;

let dataStructure: IQuestions = JSON.parse(jsonQuestions),
    result = document.querySelector("#result") as HTMLDivElement,
    el = document.querySelector("#question") as HTMLLabelElement,
    prevButton = document.querySelector("#prev") as HTMLButtonElement,
    nextButton = document.querySelector("#next") as HTMLButtonElement,
    input = document.querySelector("#answer") as HTMLInputElement,
    startButton = document.querySelector("#start") as HTMLButtonElement,
    resetButton = document.querySelector("#reset") as HTMLButtonElement,
    stopButton = document.querySelector("#finish") as HTMLButtonElement,
    questionnaire = document.querySelector("#questionnaire") as HTMLDivElement,
    solvePart = document.querySelector("#solvePart") as HTMLDivElement,
    timerParagraph = document.querySelector("#timer") as HTMLParagraphElement,
    infoParagraph = document.querySelector("#info") as HTMLParagraphElement,
    penaltyList = document.querySelector("#penaltyList") as HTMLUListElement,
    solve = 0, akt = 0, startTimeSec = 0, totalResult = 0;

for (var i = 0; i < dataStructure.length; i++) {
    let li = document.createElement('li');
    penaltyList.appendChild(li);
    li.innerHTML = "Pytanie " + (i + 1) + " - kara: " + dataStructure[i].penalty + "s.";
}

function start() {
    infoParagraph.innerHTML = "Pytanie 1, kara za błędną odpowiedź: "
        + dataStructure[0].penalty + "s.";
    keepgoin = true;
    timer();
    startButton.hidden = true;
    stopButton.hidden = true;
    solvePart.hidden = false;
    input.value = "";
    prevButton.disabled = true;
    nextButton.disabled = false;
    for (var i = 0; i < dataStructure.length; i++)
        dataStructure[i].answer = "";
    akt = 0;
    startTimeSec = 0;
    solve = 0;
    el.textContent = dataStructure[akt].question;
}

function reset() {
    result.hidden = true;
    questionnaire.hidden = false;
    startButton.hidden = false;
    solvePart.hidden = true;
    startover();
}

function change(x: number) {
    let currentTimeSec = currentsec + currentmin * 60;
    akt += x;

    if (akt == 0)
        prevButton.disabled = true;
    if (akt == dataStructure.length - 2)
        nextButton.disabled = false;
    if (akt == dataStructure.length - 1)
        nextButton.disabled = true;
    if (akt == 1)
        prevButton.disabled = false;

    if (dataStructure[akt - x].answer == "" && input.value != "")
        solve++;
    if (dataStructure[akt - x].answer != "" && input.value == "")
        solve--;
    if (solve == dataStructure.length ||
        (solve == dataStructure.length - 1 && dataStructure[akt].answer == ""))
        stopButton.hidden = false;
    else
        stopButton.hidden = true;

    dataStructure[akt - x].answer = input.value;
    dataStructure[akt - x].time += (currentTimeSec - startTimeSec);

    el.textContent = dataStructure[akt].question;
    input.value = dataStructure[akt].answer;
    infoParagraph.innerHTML = "Pytanie " + (akt + 1) + ", kara za błędną odpowiedź: "
        + dataStructure[akt].penalty + "s.";
    startTimeSec = currentTimeSec;
}

function check() {
    if (input.value != "" && (solve == dataStructure.length ||
        (solve == dataStructure.length - 1 && dataStructure[akt].answer == "")))
        stopButton.disabled = false;
    else
        stopButton.disabled = true;
}

function finish() {
    let currentTimeSec = currentsec + currentmin * 60;
    dataStructure[akt].answer = input.value;
    dataStructure[akt].time += (currentTimeSec - startTimeSec);

    startover();

    questionnaire.hidden = true;
    result.hidden = false;

    totalResult = 0;
    let listElement = document.querySelector("#resultList"),
        resultParagaph = document.querySelector("#resultParagraph");

    listElement.innerHTML = "";

    dataStructure.forEach(function (item) {
        totalResult += item.time;
        totalResult += ((item.answer == item.result) ? 0 : item.penalty);
        let li = document.createElement('li');
        listElement.appendChild(li);
        li.innerHTML += "Równanie: " + item.question + item.result + ". Twoja odpowiedź: "
            + item.answer + ". Czas: " + item.time + "s. " +
            ((item.answer == item.result) ? "Ok" : ("Źle, kara: " + item.penalty + "s")) + ".";
    });

    resultParagaph.innerHTML = "Wynik: " + totalResult + "s.";
}

let currentsec = 0;
let currentmin = 0;
let Strmin = "00";
let Strsec = "00";
let keepgoin = false;  // keepgoin is false
function timer() {
    timerParagraph.hidden = false;
    infoParagraph.hidden = false;
    if (keepgoin) {
        currentsec++;
        if (currentsec == 60) {  // if seconds reach 60
            currentsec = 0;  // Change seconds to zero
            currentmin += 1;  // and add one to the minute variable
        }
        Strsec = "" + currentsec;  // Convert to strings
        Strmin = "" + currentmin;  // Convert to strings
        if (Strsec.length != 2) { // if seconds string is less than
            Strsec = "0" + currentsec; // 2 characters long, pad with leading
        }    // zeros
        if (Strmin.length != 2) { // Same deal here with minutes
            Strmin = "0" + currentmin;
        }
        timerParagraph.innerHTML = "Czas rozwiązywania: " + Strmin + ":" + Strsec;
        setTimeout("timer()", 1000); // waits one second and repeats
    }
    else {
        timerParagraph.hidden = true;
        infoParagraph.hidden = true;
    }
}
function startover() {
    keepgoin = false;
    currentsec = 0;
    currentmin = 0;
    Strsec = "00";
    Strmin = "00";
}

function saveResult() {
    var storedResults = [];
    if (localStorage.getItem("results") != null)
        storedResults = JSON.parse(localStorage.getItem("results"));
    storedResults.push(totalResult);
    localStorage.setItem("results", JSON.stringify(storedResults));
    console.log(storedResults);
}

function saveResultAndStats() {
    var stats = [];
    dataStructure.forEach(function (item) { stats.push(item.time + ((item.answer == item.result) ? 0 : item.penalty)); });
    let storedResults = [];
    if (localStorage.getItem("stats") != null)
        storedResults = JSON.parse(localStorage.getItem("stats"));
    storedResults.push({ "result": totalResult, "stats": stats });
    localStorage.setItem("stats", JSON.stringify(storedResults));
    console.log(storedResults);
}

function saveAndReset() {
    saveResult();
    reset();
}

function saveResultAndStatsAndReset() {
    saveResultAndStats();
    reset();
}