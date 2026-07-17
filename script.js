const quizData = [
    // --- مستوى مبتدئ: HTML (1-7) ---
    { question: "ماذا يعني اختصار HTML؟", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink and Text Management"], correct: 0, level: "سهل" },
    { question: "أي وسم يُستخدم لإنشاء عنوان رئيسي بأكبر خط؟", options: ["<h6>", "<head>", "<h1>"], correct: 2, level: "سهل" },
    { question: "ما هو الوسم الصحيح لإنشاء سطر جديد (Break)؟", options: ["<br>", "<lb>", "<break>"], correct: 0, level: "سهل" },
    { question: "كيف نكتب وسم إنشاء رابط تشعبي صحيح؟", options: ["<a url='...'>", "<a href='...'>", "<a>"], correct: 1, level: "سهل" },
    { question: "أي وسم يُستخدم لعمل قائمة نقطية غير مرتبة؟", options: ["<ol>", "<ul>", "<li>"], correct: 1, level: "سهل" },
    { question: "ما هو الوسم المناسب لإدراج صورة في الصفحة؟", options: ["<img>", "<image>", "<picture>"], correct: 0, level: "سهل" },
    { question: "أين نكتب الميتا داتا (Metadata) مثل وسم الترميز والعنوان؟", options: ["<body>", "<footer>", "<head>"], correct: 2, level: "سهل" },

    // --- مستوى متوسط: CSS (8-14) ---
    { question: "ماذا يعني اختصار CSS؟", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Systems"], correct: 1, level: "متوسط" },
    { question: "ما هي الخاصية المسؤولة عن تغيير لون خلفية الصفحة؟", options: ["color", "background-color", "bgcolor"], correct: 1, level: "متوسط" },
    { question: "أي خاصية تُستخدم لتغيير حجم النص في CSS؟", options: ["font-size", "text-size", "font-style"], correct: 0, level: "متوسط" },
    { question: "كيف نختار عنصر يحمل id معين في ملف الـ CSS؟", options: [".classname", "#idname", "elementname"], correct: 1, level: "متوسط" },
    { question: "ما هي الخاصية التي تتحكم في المساحة الخارجية للعنصر؟", options: ["padding", "border", "margin"], correct: 2, level: "متوسط" },
    { question: "كيف نجعل النص يظهر في منتصف الصفحة؟", options: ["text-align: center", "align: center", "text-position: center"], correct: 0, level: "متوسط" },
    { question: "أي قيمة لخاصية display تجعل العناصر تترتب بجانب بعضها بمرونة？", options: ["block", "flex", "none"], correct: 1, level: "متوسط" },

    // --- مستوى متقدم: JavaScript (15-20) ---
    { question: "كيف نكتب رسالة تنبيه تفاعلية (Alert Box)؟", options: ["msg('أهلاً')", "alert('أهلاً')", "popup('أهلاً')"], correct: 1, level: "متقدم" },
    { question: "كيف ننشئ متغير قيمته ثابتة ولا يمكن تغييرها لاحقاً؟", options: ["let", "var", "const"], correct: 2, level: "متقدم" },
    { question: "أي طريقة تُستخدم لاختيار عنصر HTML عبر معرف الـ ID بتاعه؟", options: ["document.getElementById()", "document.querySelector()", "window.getId()"], correct: 0, level: "متقدم" },
    { question: "كيف نكتب دالة (Function) صحيحة في الـ JavaScript؟", options: ["function myFunction()", "def myFunction()", "void myFunction()"], correct: 0, level: "متقدم" },
    { question: "ما هي الطريقة الصحيحة لعمل شرط (If Statement)؟", options: ["if i = 5", "if (i == 5)", "if i == 5 then"], correct: 1, level: "متقدم" },
    { question: "ما هو الرمز المستخدم لعمل تعليق من سطر واحد في الجافا سكريبت؟", options: ["//", "/*", "<!--"], correct: 0, level: "متقدم" }
];

let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let studentName = "";
let timerInterval;
let timeLeft = 15;
let canClick = true;
let currentShuffledOptions = []; // مصفوفة لتخزين الاختيارات الملخبطة للسؤال الحالي

function startQuiz() {
    const nameInput = document.getElementById('student-name').value.trim();
    if (nameInput === "") {
        alert("من فضلك أدخل اسمك أولاً لبدء التحدي!");
        return;
    }
    studentName = nameInput;
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    canClick = true;
    timeLeft = 15;
    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('hearts').innerText = 3 - wrongAnswers;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);

    const currentQuiz = quizData[currentQuestion];
    document.getElementById('question-text').innerText = currentQuiz.question;
    document.getElementById('progress').innerText = `سؤال ${currentQuestion + 1} من ${quizData.length}`;
    
    const levelBadge = document.getElementById('level-badge');
    levelBadge.innerText = `مستوى: ${currentQuiz.level}`;
    levelBadge.className = "badge"; 
    if(currentQuiz.level === "سهل") levelBadge.classList.add('bg-easy');
    if(currentQuiz.level === "متوسط") levelBadge.classList.add('bg-medium');
    if(currentQuiz.level === "متقدم") levelBadge.classList.add('bg-hard');

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";
    
    // 🔀 دالة ذكية لعمل نسخة من الاختيارات ولخبطتها عشوائياً بدون تغيير البيانات الأصلية
    currentShuffledOptions = currentQuiz.options.map((option, index) => ({
        text: option,
        isCorrect: index === currentQuiz.correct
    })).sort(() => Math.random() - 0.5);

    // عرض الاختيارات بعد اللخبطة العشوائية
    currentShuffledOptions.forEach((optionObj, index) => {
        const button = document.createElement('button');
        button.innerText = optionObj.text;
        button.classList.add('option-btn');
        button.onclick = () => checkAnswer(button, optionObj.isCorrect);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedButton, isCorrect) {
    if (!canClick) return;
    canClick = false;
    clearInterval(timerInterval);

    const allButtons = document.querySelectorAll('.option-btn');

    if (isCorrect) {
        score++;
        selectedButton.classList.add('correct-flash');
        setTimeout(() => { nextQuestion(); }, 1500);
    } else {
        wrongAnswers++;
        selectedButton.classList.add('wrong-flash');
        
        // البحث عن الزر الذي يحتوي على الإجابة الصحيحة لتلوينه بالأخضر
        currentShuffledOptions.forEach((optionObj, index) => {
            if (optionObj.isCorrect) {
                allButtons[index].classList.add('correct-flash');
            }
        });

        setTimeout(() => {
            if (wrongAnswers >= 3) {
                showResults(true);
            } else {
                nextQuestion();
            }
        }, 1500);
    }
}

function handleTimeout() {
    if (!canClick) return;
    canClick = false;
    
    wrongAnswers++;
    const allButtons = document.querySelectorAll('.option-btn');
    
    // تلوين الإجابة الصحيحة بالأخضر عند انتهاء الوقت
    currentShuffledOptions.forEach((optionObj, index) => {
        if (optionObj.isCorrect && allButtons[index]) {
            allButtons[index].classList.add('correct-flash');
        }
    });

    setTimeout(() => {
        if (wrongAnswers >= 3) {
            showResults(true);
        } else {
            nextQuestion();
        }
    }, 1500);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults(false);
    }
}

function showResults(isGameOver) {
    clearInterval(timerInterval);
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = quizData.length;
    
    const congratsText = document.getElementById('congrats-text');
    const resultTitle = document.getElementById('result-title');
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => star.classList.remove('active'));

    let statusText = "";
    if (isGameOver) {
        resultTitle.innerText = "💥 انتهت المحاولات (Game Over) 💥";
        congratsText.innerText = `للأسف يا ${studentName}، أجبت على 3 أسئلة خاطئة وتم إقصاؤك.`;
        stars[0].classList.add('active');
        statusText = "إقصاء ❌";
    } else {
        resultTitle.innerText = "🎉 تهانينا.. أكملت التحدي! 🎉";
        if (score >= 18) {
            congratsText.innerText = `عبقري برمجيات يا ${studentName}! قفلت التحدي بالكامل 🏆🌟`;
            stars[0].classList.add('active');
            stars[1].classList.add('active');
            stars[2].classList.add('active');
        } else {
            congratsText.innerText = `عمل ممتاز ورائع يا ${studentName}! لقد اجتزت الـ 20 سؤالاً بنجاح 👍`;
            stars[0].classList.add('active');
            stars[1].classList.add('active');
        }
        statusText = "ناجح أكمل التحدي 🏆";
    }

    saveToVault(studentName, score, statusText);
}

function saveToVault(name, finalScore, status) {
    let currentData = JSON.parse(localStorage.getItem('quizVault')) || [];
    
    let newEntry = {
        name: name,
        score: `${finalScore} / 20`,
        status: status,
        date: new Date().toLocaleString('ar-EG')
    };
    
    currentData.push(newEntry);
    localStorage.setItem('quizVault', JSON.stringify(currentData));
}

function openVaultPasswordPrompt() {
    const password = prompt("الرجاء إدخال كلمة السر لفتح الخزنة السرية:");
    
    if (password === "202063") {
        clearInterval(timerInterval);
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('result-screen').classList.add('hidden');
        document.getElementById('vault-screen').classList.remove('hidden');
        
        displayVaultData();
    } else if (password !== null) {
        alert("كلمة السر خاطئة! الوصول مرفوض 🔒");
    }
}

function displayVaultData() {
    const tbody = document.getElementById('vault-tbody');
    tbody.innerHTML = "";
    
    let currentData = JSON.parse(localStorage.getItem('quizVault')) || [];
    
    if(currentData.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; color:#94a3b8;'>لا توجد نتائج مسجلة حتى الآن.</td></tr>";
        return;
    }
    
    currentData.forEach(entry => {
        const row = document.createElement('tr');
        const isWin = entry.status.includes('🏆');
        const statusClass = isWin ? 'status-win' : 'status-lose';

        row.innerHTML = `
            <td><strong>${entry.name}</strong></td>
            <td>${entry.score}</td>
            <td class="${statusClass}">${entry.status}</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(row);
    });
}

function closeVault() {
    document.getElementById('vault-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
    restartApp();
}

function clearVaultData() {
    if (confirm("هل أنت متأكد من رغبتك في حذف كل نتائج الطلاب المخزنة نهائياً؟")) {
        localStorage.removeItem('quizVault');
        displayVaultData();
    }
}

function restartApp() {
    currentQuestion = 0;
    score = 0;
    wrongAnswers = 0;
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('student-name').value = "";
}