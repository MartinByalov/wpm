

const WPM_WORD_LENGTH = 5; 
const FIXED_TIME_SECONDS = 1200; 

let REFERENCE_TEXT = "до ОКРЪЖЕН СЪД ГРАД ПЛОВДИВ ИСКОВА МОЛБА от ГЕОРГИ ПЕТРОВ ЗАПРЯНОВ с ЕГН 7405066978, с постоянен адрес: Област Пловдив, Община Пловдив, град Пловдив, ул. „Гео Милев” № 34, представляван от адв. Христо Иванов, със съдебен адрес: гр. Пловдив, п.к 4000, ул. „Хан Кубрат” № 15 СРЕЩУ Иван Тихомиров Стоянов ЕГН 4201316589 и Виолета Маринова Стоянова ЕГН 5103065372, живущи в гр. Пловдив, ул. “Георги Данчов” №45 Основание: чл.19, ал.3 от ЗЗД Цена на иска: 60 000 лв. УВАЖАЕМИ ОКРЪЖЕН СЪДИЯ, На 11.04.2023 г. с ответниците Иван Тихомиров Стоянов ЕГН 4201316589 и Виолета Маринова Стоянова ЕГН 5103065372 подписахме предварителен договор, съгласно който поехме задължението да сключим окончателен договор с предмет прехвърляне на правото на собственост на следния недвижим имот, находящ се в гр. Пловдив, ул. “Георги Данчов” №45: Апартамент №17 на 4 етаж, вх.А, състоящ се от две стаи, дневна, кабинет и кухня на 100,95 кв.м. и мазе №11, вх.А на 7,10 кв.м. с 3,943696 ид.ч. от общите части на сградата с право на строеж при граници на апартамента: стълбище, от две страни улица, ап.18 и при граници на мазето: от две страни коридор, мазе 10- вх. А /без таван/. Срокът за подписване на окончателния договор изтече на 11.01.2024г., като всички условия за неговото сключване към момента на предявяване на исковата молба са изпълнени. Всички поети от мен задължения и ангажименти по този договор са изпълнени в уговорените за това срокове. Въпреки това, ответникът не изпълни задължението си да сключи окончателен договор в посочения срок, поради което за мен се поражда правен интерес от предявяване на настоящия иск. Ето защо и като се убедите в гореизложеното, Ви моля да обявите за окончателен сключеният на 11.04.2023 г. между мен и ответниците Иван Тихомиров Стоянов и Виолета Маринова Стоянова предварителен договор за прехвърляне на правото на собственост на Апартамент №17, ет.4, вх.А, находящ се в гр. Пловдив, ул. “Георги Данчов” №45, като претендирам и направените по делото разноски. Настоящата искова молба подавам с копие за насрещната страна, ведно с приложенията към нея. Писмени доказателства: 1. Предварителен договор, описан по-горе. 2. Разписки. 3. Удостоверение за актуално състояние Приложения: 1. Препис от исковата молба и приложенията към нея 2. Пълномощно 3. Документ за заплатена държавна такса. С уважение:";

REFERENCE_TEXT = REFERENCE_TEXT.replace(/[„“”]/g, '"'); 

const REFERENCE_CHARS = REFERENCE_TEXT.split('');

const textInput = document.getElementById('textInput'); 
const timerDisplay = document.getElementById('timer');
const charCountDisplay = document.getElementById('charCount'); 
const correctCharCountDisplay = document.getElementById('correctCharCount'); 
const errorCountDisplay = document.getElementById('errorCount');
const wpmCountDisplay = document.getElementById('wpmCount');
const testStatusDisplay = document.getElementById('testStatus');
const resetButton = document.getElementById('resetButton'); 
const referenceTextDisplay = document.getElementById('referenceText');
const downloadButton = document.getElementById('downloadButton');

let isTimerRunning = false;
let startTime = 0;
let timerInterval = null;
let selectedTime = FIXED_TIME_SECONDS; 
let remainingTime = selectedTime; 
let correctChars = 0;
let errors = 0;

function normalizeText(text) {
    let cleanText = text.replace(/\ufeff/g, '').replace(/\u00a0/g, ' '); 
    cleanText = cleanText.replace(/\n/g, ''); 
    cleanText = cleanText.replace(/[„“”’]/g, '"'); 
    return cleanText;
}

function exportText() {
    const text = textInput.innerText; 
    const allCharsCount = charCountDisplay.textContent;
    const correctCount = correctCharCountDisplay.textContent;
    const errorCount = errorCountDisplay.textContent;
    const wpm = wpmCountDisplay.textContent;
    
    const totalTimeSeconds = selectedTime; 

    const statsHTML = `
        <h2 style="color: #004d40;">Резултати от теста за скорост на писане</h2>
        <p><strong>Дата:</strong> ${new Date().toLocaleString('bg-BG')}</p>
        <p><strong>Общо време на теста:</strong> ${formatTime(totalTimeSeconds)}</p>
        <p><strong>Общо въведени символи:</strong> ${allCharsCount}</p>
        <p><strong>Коректно въведени символи:</strong> ${correctCount}</p>
        <p><strong>Общо грешки:</strong> <span style="color: red; font-weight: bold;">${errorCount}</span></p>
        <p><strong>Нетна скорост (WPM):</strong> ${wpm}</p>
        <hr style="margin: 20px 0;">
        <h2 style="color: #004d40;">Въведен текст:</h2>
        <div style="font-family: Arial, sans-serif; white-space: pre-wrap; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9;">
            ${text.replace(/\n/g, '<br>')}
        </div>
    `;

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>WPM Тест Резултат</title>
            <style>
                body { font-family: 'Arial', sans-serif; }
                h2 { margin-top: 15px; }
            </style>
        </head>
        <body>
            ${statsHTML}
        </body>
        </html>
    `;
    
    const mimeType = 'application/msword';
    const blob = new Blob([htmlContent], { type: mimeType });
    const fileName = `WPM_Test_Result_${new Date().toISOString().slice(0, 10)}.doc`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href); 
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function initReferenceText() {
    referenceTextDisplay.innerHTML = REFERENCE_CHARS.map((char, index) => {
        const content = char; 
        return `<span id="ref-char-${index}">${content}</span>`;
    }).join('');
    
    highlightReferenceChar(0, 'next-char-ref');
}

function highlightReferenceChar(index, className, remove = false) {
    const charSpan = document.getElementById(`ref-char-${index}`);
    if (charSpan) {
        if (remove) {
            charSpan.classList.remove(className);
        } else {
            charSpan.classList.add(className);
        }
    }
}

function autoScrollReferenceText(nextIndex) {
    const nextCharSpan = document.getElementById(`ref-char-${nextIndex}`);
    if (nextCharSpan) {
        nextCharSpan.scrollIntoView({
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
}

function updateStatsAndHighlight() {
    const rawInput = normalizeText(textInput.innerText);
    const inputChars = rawInput.split('');
    const charCount = rawInput.length;
    
    const selection = window.getSelection();
    
    let htmlOutput = '';
    correctChars = 0;
    errors = 0;
    
    referenceTextDisplay.querySelectorAll('span').forEach(span => {
        span.classList.remove('next-char-ref', 'correct-char-ref');
    });

    for (let i = 0; i < inputChars.length; i++) {
        const inputChar = inputChars[i];
        const refChar = REFERENCE_CHARS[i]; 
        
        if (refChar !== undefined) {
            if (inputChar === refChar) {
                correctChars++;
                highlightReferenceChar(i, 'correct-char-ref');
                htmlOutput += inputChar === ' ' ? '&nbsp;' : inputChar; 
            } else {
                errors++;
                htmlOutput += `<span class="incorrect-char-input">${inputChar === ' ' ? '&nbsp;' : inputChar}</span>`;
            }
        } else {
            errors++;
            htmlOutput += `<span class="incorrect-char-input">${inputChar === ' ' ? '&nbsp;' : inputChar}</span>`;
        }
    }
    
    let nextIndex = inputChars.length;
    
    if (nextIndex < REFERENCE_CHARS.length) {
        highlightReferenceChar(nextIndex, 'next-char-ref');
        autoScrollReferenceText(nextIndex);
    }
    
    const totalCorrectWords = correctChars / WPM_WORD_LENGTH;

    if (isTimerRunning || remainingTime === 0) {
        const elapsedTime = (selectedTime - remainingTime) / 60; 
        let wpm = 0;

        if (elapsedTime > 0) {
            wpm = totalCorrectWords / elapsedTime; 
        }

        wpmCountDisplay.textContent = wpm.toFixed(2);
    }
    
    charCountDisplay.textContent = charCount;
    correctCharCountDisplay.textContent = correctChars; 
    errorCountDisplay.textContent = errors;
    
    textInput.innerHTML = htmlOutput;
    
    const newRange = document.createRange();
    newRange.selectNodeContents(textInput);
    newRange.collapse(false); 
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    if (nextIndex >= REFERENCE_CHARS.length && isTimerRunning) {
        endTest(true);
    }
}

function endTest(completed) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    textInput.contentEditable = 'false';
    textInput.classList.add('test-finished'); 

    const finalElapsedTime = (selectedTime - remainingTime) / 60; 
    const totalCorrectWords = correctChars / WPM_WORD_LENGTH;
    const finalWPM = finalElapsedTime > 0 ? totalCorrectWords / finalElapsedTime : 0;
    wpmCountDisplay.textContent = finalWPM.toFixed(2);

    testStatusDisplay.textContent = completed ? 
        'Тестът завърши! Натиснете бутона за изтегляне.' : 
        'Времето изтече! Натиснете бутона за изтегляне.';
        
    testStatusDisplay.className = 'status-finished';
    
    downloadButton.style.display = 'block';
}

function updateTimer() {
    
    if (remainingTime <= 0) {
        remainingTime = 0;
        endTest(false);
    } else {
        remainingTime--;
    }
    
    timerDisplay.textContent = formatTime(remainingTime);
    if (isTimerRunning) {
        updateStatsAndHighlight(); 
    }
}

function startTimer() {
    if (isTimerRunning) return; 

    isTimerRunning = true;
    startTime = Date.now();
    
    timerInterval = setInterval(updateTimer, 1000); 

    textInput.classList.remove('test-finished');
    textInput.contentEditable = 'true';
    testStatusDisplay.textContent = 'Тестът тече...';
    testStatusDisplay.className = 'status-running';
    
    downloadButton.style.display = 'none';
}

function resetTest() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    
    remainingTime = selectedTime; 

    correctChars = 0;
    errors = 0;

    timerDisplay.textContent = formatTime(remainingTime);
    textInput.innerText = '';
    textInput.contentEditable = 'true';
    textInput.classList.remove('test-finished');
    charCountDisplay.textContent = '0';
    correctCharCountDisplay.textContent = '0'; 
    errorCountDisplay.textContent = '0';
    wpmCountDisplay.textContent = '0.00';
    testStatusDisplay.textContent = 'Очаква старт...';
    testStatusDisplay.className = 'status-running';

    downloadButton.style.display = 'none';

    initReferenceText(); 
    textInput.focus(); 
    referenceTextDisplay.scrollTop = 0;
}

textInput.addEventListener('input', (event) => {
    const rawText = normalizeText(textInput.innerText);
    if (!isTimerRunning && rawText.length > 0) {
        startTimer();
    }
    updateStatsAndHighlight();
});

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
    }
});

resetButton.addEventListener('click', resetTest);
downloadButton.addEventListener('click', exportText); 

remainingTime = selectedTime; 
initReferenceText();
timerDisplay.textContent = formatTime(remainingTime);
textInput.focus();

