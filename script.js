const contactForm = document.getElementById("contact-form");
const benefitForm = document.getElementById("benefit-form");
const benefitsList = document.getElementById("benefits-list");
const footerTime = document.getElementById("footer-time");

const benefitTitleInput = document.getElementById("benefit-title");
const benefitDescriptionInput = document.getElementById("benefit-description");

const secondLargestOutput = document.getElementById("second-largest-output");
const uniqueElementsOutput = document.getElementById("unique-elements-output");
const studentAverageList = document.getElementById("student-average-list");
const topStudentOutput = document.getElementById("top-student-output");
const qaList = document.getElementById("qa-list");

const timerDisplay = document.getElementById("timer-display");
const timerMessage = document.getElementById("timer-message");
const startTimerButton = document.getElementById("start-timer-btn");
const pauseTimerButton = document.getElementById("pause-timer-btn");
const resetTimerButton = document.getElementById("reset-timer-btn");

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const taskOneNumbers = [23, 45, 67, 89, 12, 90, 44];
const taskTwoFirstArray = [2, 4, 6, 8, 10];
const taskTwoSecondArray = [6, 8, 10, 12, 14];
const students = [
    { name: "Alice", age: 22, scores: [78, 85, 92] },
    { name: "Bob", age: 20, scores: [88, 90, 76] },
    { name: "Charlie", age: 21, scores: [95, 80, 85] }
];

const qaContent = [
    {
        question: "Why did I choose web development as my favorite hobby?",
        answer: "I chose web development because it gives me a mix of creativity and logic. I like designing how something should look, and I also enjoy figuring out how to make it work properly."
    },
    {
        question: "What am I learning right now?",
        answer: "Right now I am focusing on the MERN stack through the Vineyard program. It is helping me understand how different parts of a full project connect with each other."
    },
    {
        question: "Which part of coding do I enjoy the most?",
        answer: "I enjoy the part where a rough idea slowly becomes a real feature. Even a small section feels satisfying when the layout, logic, and final output all start working together."
    },
    {
        question: "What do I want to improve next?",
        answer: "I want to get better at writing cleaner JavaScript and building projects with a stronger structure. I also want to practice making my pages more responsive and user-friendly."
    }
];

const oneHourInSeconds = 60 * 60;
let timeLeft = oneHourInSeconds;
let timerId = null;
let qaItems = [];

if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
}

if (benefitForm && benefitsList && benefitTitleInput && benefitDescriptionInput) {
    benefitForm.addEventListener("submit", handleBenefitSubmit);
    benefitsList.addEventListener("click", handleBenefitDelete);
}

if (startTimerButton && pauseTimerButton && resetTimerButton) {
    startTimerButton.addEventListener("click", startTimer);
    pauseTimerButton.addEventListener("click", pauseTimer);
    resetTimerButton.addEventListener("click", resetTimer);
}

function handleContactSubmit(event) {
    event.preventDefault();
    alert("Thank you for your message! Your form has been submitted successfully.");
    contactForm.reset();
}

function handleBenefitSubmit(event) {
    event.preventDefault();

    const title = benefitTitleInput.value.trim();
    const description = benefitDescriptionInput.value.trim();

    if (!title || !description) {
        return;
    }

    benefitsList.appendChild(buildBenefitItem(title, description));
    benefitForm.reset();
    benefitTitleInput.focus();
}

function handleBenefitDelete(event) {
    const removeButton = event.target.closest(".delete-btn");

    if (!removeButton) {
        return;
    }

    const listItem = removeButton.closest(".benefit-item");

    if (listItem) {
        listItem.remove();
    }
}

function buildBenefitItem(title, description) {
    const listItem = document.createElement("li");
    listItem.className = "benefit-item";

    const shell = document.createElement("div");
    shell.className = "benefit-shell";

    const copy = document.createElement("span");
    copy.className = "benefit-copy";

    const strong = document.createElement("strong");
    strong.textContent = `${title}:`;

    copy.append(strong, ` ${description}`);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "delete-btn";
    button.textContent = "Remove";
    button.setAttribute("aria-label", `Remove ${title} benefit`);

    shell.append(copy, button);
    listItem.appendChild(shell);

    return listItem;
}

class QAItem {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
        this.isOpen = false;
        this.details = null;
        this.summary = null;
        this.answerShell = null;
        this.cue = null;
    }

    render() {
        const details = document.createElement("details");
        details.className = "qa-item";

        const summary = document.createElement("summary");
        summary.className = "qa-question";
        summary.setAttribute("aria-expanded", "false");

        const questionText = document.createElement("span");
        questionText.className = "qa-question-text";
        questionText.textContent = this.question;

        const cue = document.createElement("span");
        cue.className = "qa-cue";
        cue.setAttribute("aria-hidden", "true");

        const answerShell = document.createElement("div");
        answerShell.className = "qa-answer-shell";

        const answer = document.createElement("div");
        answer.className = "qa-answer";

        const answerParagraph = document.createElement("p");
        answerParagraph.textContent = this.answer;

        answer.appendChild(answerParagraph);
        answerShell.appendChild(answer);
        summary.append(questionText, cue);
        details.append(summary, answerShell);

        this.details = details;
        this.summary = summary;
        this.answerShell = answerShell;
        this.cue = cue;

        this.updateCue();

        summary.addEventListener("click", (event) => {
            event.preventDefault();
            this.toggle();
        });

        return details;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
            return;
        }

        this.open();
    }

    open() {
        if (!this.details || !this.answerShell) {
            return;
        }

        this.isOpen = true;
        this.details.open = true;
        this.summary.setAttribute("aria-expanded", "true");
        this.details.classList.add("is-open");

        requestAnimationFrame(() => {
            this.answerShell.style.maxHeight = `${this.answerShell.scrollHeight}px`;
        });

        this.updateCue();
    }

    close() {
        if (!this.details || !this.answerShell) {
            return;
        }

        this.isOpen = false;
        this.summary.setAttribute("aria-expanded", "false");
        this.answerShell.style.maxHeight = `${this.answerShell.scrollHeight}px`;

        requestAnimationFrame(() => {
            this.details.classList.remove("is-open");
            this.answerShell.style.maxHeight = "0px";
        });

        this.answerShell.addEventListener("transitionend", () => {
            if (!this.isOpen) {
                this.details.open = false;
            }
        }, { once: true });

        this.updateCue();
    }

    updateCue() {
        if (!this.cue) {
            return;
        }

        this.cue.textContent = this.isOpen ? "-" : "+";
    }
}

function renderQuestionSection() {
    if (!qaList) {
        return;
    }

    qaList.innerHTML = "";
    qaItems = qaContent.map(function (entry) {
        return new QAItem(entry.question, entry.answer);
    });

    qaItems.forEach(function (item) {
        qaList.appendChild(item.render());
    });
}

function showAssignmentResults() {
    const secondLargestNumber = findSecondLargest(taskOneNumbers);
    const uniqueValues = getUniqueValues(taskTwoFirstArray, taskTwoSecondArray);
    const report = analyzeStudents(students);

    if (secondLargestOutput) {
        secondLargestOutput.textContent = secondLargestNumber;
    }

    if (uniqueElementsOutput) {
        uniqueElementsOutput.textContent = `[${uniqueValues.join(", ")}]`;
    }

    if (studentAverageList) {
        studentAverageList.innerHTML = "";

        report.averages.forEach(function (entry) {
            const item = document.createElement("li");
            item.textContent = `${entry.name}: ${entry.average.toFixed(2)}`;
            studentAverageList.appendChild(item);
        });
    }

    if (topStudentOutput) {
        topStudentOutput.innerHTML = `Top student: <strong>${report.topStudent.name}</strong> with an average score of <strong>${report.topStudent.average.toFixed(2)}</strong>.`;
    }

    console.log("Task 1 - Second largest number:", secondLargestNumber);
    console.log("Task 2 - Unique elements:", uniqueValues);
    console.log(`Task 3 - Top Student: ${report.topStudent.name} with an average score of ${report.topStudent.average.toFixed(2)}.`);
}

function findSecondLargest(numbers) {
    let biggest = -Infinity;
    let secondBiggest = -Infinity;

    numbers.forEach(function (number) {
        if (number > biggest) {
            secondBiggest = biggest;
            biggest = number;
            return;
        }

        if (number > secondBiggest && number !== biggest) {
            secondBiggest = number;
        }
    });

    return secondBiggest;
}

function getUniqueValues(firstArray, secondArray) {
    const combined = firstArray.concat(secondArray);
    const uniqueValues = [];

    combined.forEach(function (value) {
        if (!uniqueValues.includes(value)) {
            uniqueValues.push(value);
        }
    });

    return uniqueValues;
}

function analyzeStudents(studentList) {
    const averages = [];
    let topStudent = null;

    studentList.forEach(function (student) {
        let total = 0;

        student.scores.forEach(function (score) {
            total += score;
        });

        const average = total / student.scores.length;
        const entry = {
            name: student.name,
            average: average
        };

        averages.push(entry);

        if (!topStudent || average > topStudent.average) {
            topStudent = entry;
        }
    });

    return { averages: averages, topStudent: topStudent };
}

function startTimer() {
    if (timerId) {
        return;
    }

    if (timeLeft === 0) {
        timerMessage.textContent = "The countdown is over. Press reset to start again.";
        return;
    }

    timerMessage.textContent = "";

    timerId = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft -= 1;
            drawTimer();
        }

        if (timeLeft === 0) {
            pauseTimer();
            timerMessage.textContent = "Time is up!";
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerId) {
        return;
    }

    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = oneHourInSeconds;
    timerMessage.textContent = "";
    drawTimer();
}

function drawTimer() {
    if (!timerDisplay) {
        return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateFooterTime() {
    if (!footerTime) {
        return;
    }

    const now = new Date();
    const day = dayNames[now.getDay()];
    const date = String(now.getDate()).padStart(2, "0");
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    footerTime.textContent = `${day}, ${date} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

renderQuestionSection();
showAssignmentResults();
drawTimer();
updateFooterTime();
setInterval(updateFooterTime, 1000);
