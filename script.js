document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded")

  // DOM Elements
  const startScreen = document.getElementById("start-screen")
  const categoryScreen = document.getElementById("category-screen")
  const questionScreen = document.getElementById("question-screen")
  const completionScreen = document.getElementById("completion-screen")

  const startBtn = document.getElementById("start-btn")
  const backToStartArrow = document.getElementById("back-to-start-arrow")
  const categoryCards = document.querySelectorAll(".category-card")
  const tryAgainBtn = document.getElementById("try-again-btn")
  const homeBtn = document.getElementById("home-btn")

  const questionText = document.getElementById("question-text")
  const currentQuestionNum = document.getElementById("current-question")
  const currentCategoryBadge = document.getElementById("current-category")
  const optionBtns = document.querySelectorAll(".option-btn")
  const timerText = document.getElementById("timer-text")
  const timerProgress = document.querySelector(".timer-progress")
  const finalScore = document.getElementById("final-score")

  console.log("Elements loaded:", startBtn, categoryCards, tryAgainBtn)

  // Quiz State
  let currentQuestion = 0
  let score = 0
  let timer
  let timeLeft = 30
  let isAnswered = false
  let selectedCategory = ""
  let timerExpired = false
  let currentPoints = 0 // Add points tracking

  // Timer constants
  const TIMER_FULL = 30
  const TIMER_CIRCUMFERENCE = 188.5 // 2 * PI * 30 (circle radius)

  // Quiz Questions by Category
  const questions = {
    history: [
      {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctIndex: 1,
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"],
        correctIndex: 2,
      },
      {
        question: "Which ancient civilization built the pyramids of Giza?",
        options: ["Romans", "Greeks", "Mayans", "Egyptians"],
        correctIndex: 3,
      },
      {
        question: "The Renaissance period began in which country?",
        options: ["France", "England", "Italy", "Germany"],
        correctIndex: 2,
      },
      {
        question: "Who wrote 'The Communist Manifesto'?",
        options: ["Vladimir Lenin", "Joseph Stalin", "Karl Marx", "Friedrich Nietzsche"],
        correctIndex: 2,
      },
      {
        question: "Which empire was ruled by Genghis Khan?",
        options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "Byzantine Empire"],
        correctIndex: 2,
      },
      {
        question: "The French Revolution began in which year?",
        options: ["1789", "1776", "1804", "1812"],
        correctIndex: 0,
      },
      {
        question: "Who was the first woman to win a Nobel Prize?",
        options: ["Mother Teresa", "Marie Curie", "Rosa Parks", "Florence Nightingale"],
        correctIndex: 1,
      },
      {
        question: "Which country was NOT part of the Allied Powers during World War II?",
        options: ["United States", "Soviet Union", "Japan", "United Kingdom"],
        correctIndex: 2,
      },
      {
        question: "The Berlin Wall fell in which year?",
        options: ["1985", "1989", "1991", "1993"],
        correctIndex: 1,
      },
    ],
    entertainment: [
      {
        question: "Who played the character of Iron Man in the Marvel Cinematic Universe?",
        options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
        correctIndex: 2,
      },
      {
        question: "Which band performed the song 'Bohemian Rhapsody'?",
        options: ["The Beatles", "Led Zeppelin", "Queen", "The Rolling Stones"],
        correctIndex: 2,
      },
      {
        question: "What is the highest-grossing film of all time (as of 2023)?",
        options: ["Avengers: Endgame", "Avatar", "Titanic", "Star Wars: The Force Awakens"],
        correctIndex: 1,
      },
      {
        question: "Who wrote the Harry Potter book series?",
        options: ["J.R.R. Tolkien", "J.K. Rowling", "Stephen King", "George R.R. Martin"],
        correctIndex: 1,
      },
      {
        question: "Which TV show features characters named Ross, Rachel, Monica, Chandler, Joey, and Phoebe?",
        options: ["How I Met Your Mother", "The Big Bang Theory", "Friends", "Seinfeld"],
        correctIndex: 2,
      },
      {
        question: "Who is known as the 'King of Pop'?",
        options: ["Elvis Presley", "Michael Jackson", "Prince", "David Bowie"],
        correctIndex: 1,
      },
      {
        question: "Which movie won the Academy Award for Best Picture in 2020?",
        options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
        correctIndex: 2,
      },
      {
        question: "Which video game franchise features a character named Master Chief?",
        options: ["Call of Duty", "Halo", "Destiny", "Gears of War"],
        correctIndex: 1,
      },
      {
        question: "Who directed the movie 'Jurassic Park'?",
        options: ["James Cameron", "George Lucas", "Steven Spielberg", "Christopher Nolan"],
        correctIndex: 2,
      },
      {
        question: "Which of these is NOT one of the Spice Girls?",
        options: ["Sporty Spice", "Posh Spice", "Baby Spice", "Sassy Spice"],
        correctIndex: 3,
      },
    ],
    riddles: [
      {
        question:
          "I speak without a mouth and hear without ears. I have no body, but I come alive with wind.",
        options: ["Echo", "Shadow", "Thought", "Dream"],
        correctIndex: 0,
      },
      {
        question: "What has keys but no locks, space but no room, and you can enter but not go in?",
        options: ["Keyboard", "Map", "Mind", "Book"],
        correctIndex: 0,
      },
      {
        question: "The more you take, the more you leave behind. What am I?",
        options: ["Money", "Time", "Footsteps", "Breath"],
        correctIndex: 2,
      },
      {
        question: "What has a head, a tail, is brown, and has no legs?",
        options: ["Snake", "Penny", "Worm", "Tadpole"],
        correctIndex: 1,
      },
      {
        question: "What gets wetter as it dries?",
        options: ["Sponge", "Towel", "Hair", "Soap"],
        correctIndex: 1,
      },
      {
        question: "I'm tall when I'm young, and short when I'm old. What am I?",
        options: ["Tree", "Human", "Mountain", "Candle"],
        correctIndex: 3,
      },
      {
        question: "What has many keys but can't open a single lock?",
        options: ["Piano", "Computer", "Typewriter", "All of the above"],
        correctIndex: 3,
      },
      {
        question: "What can travel around the world while staying in a corner?",
        options: ["Light", "Wind", "Stamp", "Internet"],
        correctIndex: 2,
      },
      {
        question: "What has a neck but no head?",
        options: ["Shirt", "Bottle", "Broom", "Guitar"],
        correctIndex: 1,
      },
      {
        question: "What breaks when you say it?",
        options: ["Glass", "Promise", "Silence", "Heart"],
        correctIndex: 2,
      },
    ],
    logic: [
      {
        question: "If you have a bowl with six apples and you take away four, how many do you have?",
        options: ["2", "4", "6", "10"],
        correctIndex: 1,
      },
      {
        question:
          "A doctor gives you three pills and tells you to take one every half hour. How long will the pills last?",
        options: ["30 minutes", "1 hour", "1.5 hours", "3 hours"],
        correctIndex: 1,
      },
      {
        question: "If a plane crashes on the border of the US and Canada, where do they bury the survivors?",
        options: ["US", "Canada", "Both countries", "You don't bury survivors"],
        correctIndex: 3,
      },
      {
        question: "A farmer has 17 sheep. All but 9 die. How many sheep are left?",
        options: ["8", "9", "17", "26"],
        correctIndex: 1,
      },
      {
        question: "Which weighs more: a pound of feathers or a pound of gold?",
        options: ["Feathers", "Gold", "They weigh the same", "It depends on gravity"],
        correctIndex: 0,
      },
      {
        question: "If you divide 30 by half and add 10, what do you get?",
        options: ["25", "40", "60", "70"],
        correctIndex: 2,
      },
      {
        question: "If there are 12 fish and half of them drown, how many are left?",
        options: ["6", "12", "0", "Fish don't drown"],
        correctIndex: 3,
      },
      {
        question: "How many months have 28 days?",
        options: ["1", "2", "12", "Depends on the year"],
        correctIndex: 2,
      },
      {
        question: "I am an odd number. Take away a letter and I become even. What number am I?",
        options: ["Seven", "Nine", "Five", "Three"],
        correctIndex: 0,
      },
      {
        question:
          "If 10 apples take 10 minutes to grow, how long do 50 apples take to grow?",
        options: ["10 minutes", "20 minutes", "50 minutes", "100 minute"],
        correctIndex: 0,
      },
    ],
  }

  // Event Listeners
  if (startBtn) {
    console.log("Adding click event to start button")
    startBtn.addEventListener("click", () => {
      console.log("Start button clicked")
      showCategoryScreen()
    })
  }

  if (backToStartArrow) {
    backToStartArrow.addEventListener("click", () => {
      console.log("Back arrow clicked")
      showStartScreen()
    })
  }

  if (categoryCards.length) {
    categoryCards.forEach((card) => {
      card.addEventListener("click", function () {
        selectedCategory = this.dataset.category
        console.log("Category selected:", selectedCategory)
        currentCategoryBadge.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
        currentCategoryBadge.style.background = `var(--${selectedCategory})`
        currentCategoryBadge.style.boxShadow = `0 0 10px var(--${selectedCategory}-glow)`
        startQuiz()
      })
    })
  }

  if (tryAgainBtn) {
    console.log("Adding click event to try again button")
    tryAgainBtn.addEventListener("click", () => {
      console.log("Try again button clicked")
      showCategoryScreen()
    })
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      console.log("Home button clicked")
      showStartScreen()
    })
  }

  // Make sure option buttons are clickable
  optionBtns.forEach((button, index) => {
    console.log(`Setting up click handler for option ${index + 1}`)
    button.addEventListener("click", () => {
      console.log(`Option ${index + 1} clicked`)
      if (!isAnswered && !timerExpired) {
        checkAnswer(index)
      }
    })
  })

  // Screen Navigation Functions
  function showStartScreen() {
    startScreen.classList.add("active")
    categoryScreen.classList.remove("active")
    questionScreen.classList.remove("active")
    completionScreen.classList.remove("active")
  }

  function showCategoryScreen() {
    startScreen.classList.remove("active")
    categoryScreen.classList.add("active")
    questionScreen.classList.remove("active")
    completionScreen.classList.remove("active")
  }

  function showQuestionScreen() {
    startScreen.classList.remove("active")
    categoryScreen.classList.remove("active")
    questionScreen.classList.add("active")
    completionScreen.classList.remove("active")
  }

  function showCompletionScreen() {
    startScreen.classList.remove("active")
    categoryScreen.classList.remove("active")
    questionScreen.classList.remove("active")
    completionScreen.classList.add("active")
  }

  // Quiz Functions
  function startQuiz() {
    console.log("Starting quiz with category:", selectedCategory)
    currentQuestion = 0
    score = 0
    currentPoints = 0  // Reset points
    document.getElementById("current-score").textContent = "0"  // Reset score display
    showQuestionScreen()
    loadQuestion()
  }

  function loadQuestion() {
    console.log("Loading question", currentQuestion + 1)
    if (currentQuestion >= questions[selectedCategory].length) {
      endQuiz()
      return
    }

    // Reset state for new question
    isAnswered = false
    timerExpired = false
    timeLeft = TIMER_FULL
    
    // Update UI elements
    timerText.textContent = timeLeft
    timerProgress.classList.remove("warning")
    timerProgress.style.strokeDashoffset = "0"
    document.getElementById("current-score").textContent = currentPoints // Update points display

    // Update question number
    currentQuestionNum.textContent = currentQuestion + 1

    // Load question content
    const question = questions[selectedCategory][currentQuestion]
    questionText.textContent = question.question

    // Load options
    optionBtns.forEach((button, index) => {
      button.textContent = question.options[index]
      button.classList.remove("correct", "incorrect")
    })

    // Start timer
    startTimer()
  }

  function startTimer() {
    clearInterval(timer)
    timer = setInterval(() => {
      timeLeft--
      timerText.textContent = timeLeft

      // Update timer circle progress
      const percentComplete = (TIMER_FULL - timeLeft) / TIMER_FULL
      const dashOffset = TIMER_CIRCUMFERENCE * percentComplete
      timerProgress.style.strokeDashoffset = dashOffset

      if (timeLeft <= 10 && !timerProgress.classList.contains("warning")) {
        timerProgress.classList.add("warning")
      }

      if (timeLeft <= 0) {
        clearInterval(timer)
        timerExpired = true
        if (!isAnswered) {
          // Time's up, mark correct answer and move to next question
          const correctIndex = questions[selectedCategory][currentQuestion].correctIndex
          optionBtns[correctIndex].classList.add("correct")
          setTimeout(() => {
            currentQuestion++
            loadQuestion()
          }, 1500)
        }
      }
    }, 1000)
  }

  function checkAnswer(selectedIndex) {
    console.log(`Checking answer: selected ${selectedIndex}`)
    isAnswered = true
    clearInterval(timer)

    const correctIndex = questions[selectedCategory][currentQuestion].correctIndex

    // Mark correct and incorrect answers
    if (selectedIndex === correctIndex) {
      optionBtns[selectedIndex].classList.add("correct")
      score++
      currentPoints++ // Simply increment by 1 for each correct answer
      document.getElementById("current-score").textContent = currentPoints
      console.log(`Correct! Score: ${score}, Points: ${currentPoints}`)
    } else {
      optionBtns[selectedIndex].classList.add("incorrect")
      optionBtns[correctIndex].classList.add("correct")
      console.log(`Incorrect. Correct answer was option ${correctIndex + 1}`)
    }

    // Move to next question after delay
    setTimeout(() => {
      currentQuestion++
      loadQuestion()
    }, 1500)
  }

  function endQuiz() {
    console.log("Quiz ended, score:", score, "points:", currentPoints)
    showCompletionScreen()
    finalScore.textContent = `${score}`

    // Customize completion message based on score
    const completionMessage = document.getElementById("completion-message")
    if (score >= 8) {
      completionMessage.textContent = `Excellent! You're a ${selectedCategory} master!`
    } else if (score >= 5) {
      completionMessage.textContent = `Good job! You know your ${selectedCategory} well.`
    } else {
      completionMessage.textContent = `Keep learning about ${selectedCategory}! You'll do better next time.`
    }
  }

  // Sound toggle functionality
  const audioControls = document.querySelector('.audio-controls');
  const muteToggle = document.getElementById('mute-toggle');
  const volumeControl = document.querySelector('.volume-control');
  const volumeSlider = document.querySelector('.volume-slider');
  const soundWaves = document.querySelector('.sound-waves');
  let isMuted = true; // Start muted
  let previousVolume = 0.5;

  // Initialize all audio volumes
  const allSounds = [menuSound, quizStartSound, correctSound, wrongSound, completionSound];
  allSounds.forEach(sound => {
      sound.volume = 0; // Start with volume 0
  });

  // Update initial UI state for muted
  soundWaves.style.opacity = "0";
  muteToggle.style.opacity = 0.5;
  volumeSlider.classList.add('muted');
  volumeSlider.value = 0;

  // Handle mute/unmute
  muteToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      soundWaves.style.opacity = isMuted ? "0" : "1";
      
      if (isMuted) {
          volumeSlider.classList.add('muted');
          previousVolume = volumeSlider.value / 100;
          volumeSlider.value = 0;
      } else {
          volumeSlider.classList.remove('muted');
          volumeSlider.value = previousVolume * 100;
      }
      
      allSounds.forEach(sound => {
          sound.volume = isMuted ? 0 : previousVolume;
      });
      
      muteToggle.style.opacity = isMuted ? 0.5 : 1;
  });

  // Handle volume changes
  volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      previousVolume = volume;
      
      // Automatically handle mute state based on volume
      if (volume === 0) {
          isMuted = true;
          soundWaves.style.opacity = "0";
          muteToggle.style.opacity = 0.5;
      } else {
          isMuted = false;
          soundWaves.style.opacity = "1";
          muteToggle.style.opacity = 1;
      }
      
      // Update all sound volumes
      allSounds.forEach(sound => {
          sound.volume = volume;
      });
  });

  // Show volume control on hover
  muteToggle.addEventListener('mouseenter', () => {
      volumeControl.classList.add('active');
  });

  volumeControl.addEventListener('mouseleave', () => {
      volumeControl.classList.remove('active');
  });

  // Brightness control functionality
  const brightnessToggle = document.getElementById('brightness-toggle');
  const brightnessControl = document.querySelector('.brightness-control');
  const brightnessSlider = document.querySelector('.brightness-slider');
  let currentBrightness = 100;

  // Initialize brightness
  document.body.style.filter = `brightness(${currentBrightness}%)`;
  brightnessSlider.value = currentBrightness;

  // Handle brightness changes
  brightnessSlider.addEventListener('input', (e) => {
      currentBrightness = e.target.value;
      document.body.style.filter = `brightness(${currentBrightness}%)`;
      brightnessToggle.style.opacity = currentBrightness / 100;
  });

  // Show brightness control on hover
  brightnessToggle.addEventListener('mouseenter', () => {
      brightnessControl.classList.add('active');
  });

  brightnessControl.addEventListener('mouseleave', () => {
      brightnessControl.classList.remove('active');
  });
});

