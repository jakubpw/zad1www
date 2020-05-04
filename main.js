;
;
var jsonQuestions = "[\n    {\"question\":\"2 + 2 = \", \"result\":\"4\", \"answer\":\"\", \"time\":0, \"penalty\":2},\n    {\"question\":\"2 + 3 = \", \"result\":\"5\", \"answer\":\"\", \"time\":0, \"penalty\":3},\n    {\"question\":\"2 + 4 = \", \"result\":\"6\", \"answer\":\"\", \"time\":0, \"penalty\":4},\n    {\"question\":\"2 + 5 = \", \"result\":\"7\", \"answer\":\"\", \"time\":0, \"penalty\":5}\n]";
var dataStructure = JSON.parse(jsonQuestions), result = document.querySelector("#result"), el = document.querySelector("#question"), prevButton = document.querySelector("#prev"), nextButton = document.querySelector("#next"), input = document.querySelector("#answer"), startButton = document.querySelector("#start"), resetButton = document.querySelector("#reset"), stopButton = document.querySelector("#finish"), questionnaire = document.querySelector("#questionnaire"), solvePart = document.querySelector("#solvePart"), timerParagraph = document.querySelector("#timer"), infoParagraph = document.querySelector("#info"), penaltyList = document.querySelector("#penaltyList"), solve = 0, akt = 0, startTimeSec = 0, totalResult = 0, currentSec = 0, currentMin = 0, currentMil = 0, timerOn = false;
for (var i = 0; i < dataStructure.length; i++) {
    var li = document.createElement('li');
    penaltyList.appendChild(li);
    li.innerHTML = "Pytanie " + (i + 1) + " - kara: " + dataStructure[i].penalty + "s.";
}
function start() {
    infoParagraph.innerHTML = "Pytanie 1, kara za błędną odpowiedź: "
        + dataStructure[0].penalty + "s.";
    timerOn = true;
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
    restartTimer();
}
function change(x) {
    var currentTimeSec = currentSec + currentMin * 60;
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
    var currentTimeSec = currentSec + currentMin * 60;
    dataStructure[akt].answer = input.value;
    dataStructure[akt].time += (currentTimeSec - startTimeSec);
    restartTimer();
    questionnaire.hidden = true;
    result.hidden = false;
    totalResult = 0;
    var listElement = document.querySelector("#resultList"), resultParagaph = document.querySelector("#resultParagraph");
    listElement.innerHTML = "";
    dataStructure.forEach(function (item) {
        totalResult += item.time;
        totalResult += ((item.answer == item.result) ? 0 : item.penalty);
        var li = document.createElement('li');
        listElement.appendChild(li);
        li.innerHTML += "Równanie: " + item.question + item.result + ". Twoja odpowiedź: "
            + item.answer + ". Czas: " + item.time + "s. " +
            ((item.answer == item.result) ? "Ok" : ("Źle, kara: " + item.penalty + "s")) + ".";
    });
    resultParagaph.innerHTML = "Wynik: " + totalResult + "s.";
}
function timer() {
    timerParagraph.hidden = false;
    infoParagraph.hidden = false;
    if (timerOn) {
        currentMil++;
        if (currentMil == 10) {
            currentMil = 0;
            currentSec += 1;
        }
        if (currentSec == 60) {
            currentSec = 0;
            currentMin += 1;
        }
        timerParagraph.innerHTML = "Czas rozwiązywania: " + (currentMin < 10 ? "0" : "")
            + currentMin + ":" + +(currentSec < 10 ? "0" : "") + currentSec;
        setTimeout("timer()", 100);
    }
    else {
        timerParagraph.hidden = true;
        infoParagraph.hidden = true;
    }
}
function restartTimer() {
    timerOn = false;
    currentSec = 0;
    currentMin = 0;
    currentMil = 0;
}
function saveResult() {
    var storedResults = [];
    if (localStorage.getItem("results") != null)
        storedResults = JSON.parse(localStorage.getItem("results"));
    storedResults.push(totalResult);
    localStorage.setItem("results", JSON.stringify(storedResults));
}
function saveResultAndStats() {
    var stats = [];
    dataStructure.forEach(function (item) { stats.push(item.time + ((item.answer == item.result) ? 0 : item.penalty)); });
    var storedResults = [];
    if (localStorage.getItem("stats") != null)
        storedResults = JSON.parse(localStorage.getItem("stats"));
    storedResults.push({ "result": totalResult, "stats": stats });
    localStorage.setItem("stats", JSON.stringify(storedResults));
}
function saveAndReset() {
    saveResult();
    reset();
}
function saveResultAndStatsAndReset() {
    saveResultAndStats();
    reset();
}
