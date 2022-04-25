let qanda = []
let user_answers = []
let answer_data = []
let qdata;

// Capture answer when enter is clicked and rerender question
let input = document.getElementById("answer");
input.addEventListener("keyup", capture);

function capture(e) {
  if (e.key === 'Enter') {

    // get the user input value and clear it
    const final_answer = input.value
    input.value = ''

    // store user answer along with latest question
    last_q = qanda.slice(-1)
    last_q.user_answer = final_answer

    // add question and answer data to new list and render new question
    answer_data.push(last_q)
    render_question(qdata)
  }
}  

// Run main function to store question data
main()
document.body.className = 'visible';

async function main() {
  qdata = await get_data()
}

// Grab data from api
async function get_data() {
  let response = await fetch('https://api.npoint.io/8f54821c55f6110e8299')
  let data = await response.json()
  return data
}

// Will be tied to click of start button and replay button
function start_game() {

  // clear all the data for a new game
  qanda = []
  user_answers = []
  answer_data = []

  // grab the question container and check to see if it's populated
  const full_container = document.getElementById('q-container')
  if (document.contains(document.getElementById('dollar-value'))) {

    // if populated, display it, start the time and render a question
    full_container.style.display = 'block'
    start_timer()
    render_question(qdata)
  } else {
    // if not populated, recreate the question box format
    full_container.innerHTML = ''
    full_container.innerHTML = '<div class="cat-val"> <h5 id="category"></h5><h5 id="dollar-value"></h5></div><div id="question"></div><section class="answer"><input id="answer" type="text"></section>'

    // reestablish the Enter capture
    let input = document.getElementById("answer");
    input.addEventListener("keyup", capture);

    start_timer()
    render_question(qdata)
  }

}

function produce_data() {

  // produce some data base on user's answers

  let count_correct = 0
  let total_points = 0
  const number_of_answers = answer_data.length

  computed = {}

  // get our list of acceptable answers ready
  answer_data.forEach((answer) => {

    let acceptable_answer = answer[0].acceptable_answer

    acceptable_answer = acceptable_answer.map((aa) => {
      return aa.toLowerCase().trim()
    })

    // store the user's answer
    const user_answer = answer.user_answer.toLowerCase().trim()

    // check to see if the user's answer is in the acceptable answers list
    if (acceptable_answer.includes(user_answer)){
      count_correct +=1
      total_points += answer[0].value_int
    } 
  })

  computed.total_points = String(total_points)
  computed.count_correct = count_correct
  computed.perc_correct = (count_correct/number_of_answers*100).toFixed(0)
  return computed

}

function render_data() {

  // Render the user's scoring data

  const q_divs = []

  const full_container = document.getElementById('q-container')

  answer_data.forEach((answer) => {
    let cont = document.createElement('div')
    cont.classList.add('q-div')
    const right_answer_cont = document.createElement('div')
    const user_answer_cont = document.createElement('div')

    right_answer_cont.innerHTML = answer[0].answer
    right_answer_cont.classList.add('right-answer')

    user_answer_cont.innerHTML = answer.user_answer
    user_answer_cont.classList.add('user-answer')

    cont.appendChild(right_answer_cont)
    cont.appendChild(user_answer_cont)

    q_divs.push(cont)
  })

  const data_el = document.createElement('div')
  const data_el2 = document.createElement('div')
  const data_el3 = document.createElement('div')

  const replay_btn = document.createElement('button')

  replay_btn.innerHTML = 'Play Again'
  replay_btn.classList.add('btn')
  replay_btn.classList.add('replay-btn')
  replay_btn.onclick = start_game

  full_container.innerHTML = ''
  const ready_data = produce_data()

  data_el.innerHTML = "<span style='font-size: 20px'>Number correct: </span><span style='color: lightgreen; font-size: 20px'> " + ready_data.count_correct + "</span>"
  data_el2.innerHTML = "<span style='font-size: 20px'>Percentage correct: </span><span style='color: lightgreen; font-size: 20px;'> " + ready_data.perc_correct + '%'
  data_el3.innerHTML = "<span style='font-size: 20px'>Total Value: </span><span style='color: lightgreen; font-size: 20px;' >$" + ready_data.total_points + "</span>"
  data_el.style.marginBottom = '10px'
  data_el2.style.marginBottom = '10px'
  data_el3.style.marginBottom = '20px'


  const answer_header = document.createElement('div')
  answer_header.classList.add('q-div')
  answer_header.innerHTML = "<span style='font-weight: 500; font-size: 18px;'>Correct Answers</span><span style='font-weight: 500; font-size: 18px;'>Your Answers</span>"
  answer_header.style.marginBottom = '20px'
  answer_header.style.fontSize = '20x'

  full_container.appendChild(data_el)
  full_container.appendChild(data_el2)
  full_container.appendChild(data_el3)
  full_container.appendChild(answer_header)

  q_divs.forEach((div) => {
    full_container.appendChild(div)
  })
  
  full_container.appendChild(replay_btn)
  
}

// After start_timer is called, run function after 60 seconds and then render user data after two seconds
function start_timer() {
  setTimeout(() => {
    const full_container = document.getElementById('q-container')
    full_container.innerHTML = "<span style='font-weight: bold; font-size: 24px; color: #FF6000'>Time's Up!</span>"

    setTimeout(render_data, 2000)

  }, 60000)
}


// Render a new jeopardy question for user and store
function render_question(question_data) {
  
  const one_jeopardy_question = question_data[Math.floor(Math.random() * question_data.length)];
  // one_jeopardy_question.id = Date.now() + Math.random()

  const category = document.getElementById('category')
  const dollar_value = document.getElementById('dollar-value')
  const question = document.getElementById('question')

  category.innerHTML = one_jeopardy_question.category
  dollar_value.innerHTML = one_jeopardy_question.value
  question.innerHTML = one_jeopardy_question.question

  qanda.push(one_jeopardy_question)
  
}