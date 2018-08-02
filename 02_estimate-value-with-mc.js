console.log("Estimate value function via Monte-Carlo method")
console.log("About MC : http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching_files/MC-TD.pdf")

var state_label = ['A', 'B', 'C', 'D', 'E']
var states = [0, 1, 2, 3, 4]
var values = [0, 0, 0, 0, 0]
var policy = [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]]
var goal = 3
var alpha =  0.01 	//learning rate
var batch_size = 100

function random_choice(list) { // helper function, not important
	let random_idx = Math.floor(Math.random() * list.length)
	return list[random_idx]
}

function get_next_state(state, action){
	return Math.max(Math.min(state + action, 4), 0)
}

function get_reward(state, action){
	let new_state = get_next_state(state, action)
	if(new_state == goal) //when it's goal
		return 1
	return -1
}

function get_actions(state){
	if(state == goal)
		return []
	return policy[state]
}

function get_value(state){
	return values[state]
}


function play_episode(start_state) {
	let state = start_state
	// let history = [state]
	let reward = 0

	// take action until there's no more actions avalilable
	while((actions = get_actions(state)).length > 0){ 
		let action = random_choice(actions)
		let next_state = get_next_state(state, action)
		reward += get_reward(state, action)
		// history.push(next_state)
		state = next_state
	}

	return {start_state, reward};	
}

function collect_samples(num) {
	let samples = []
	for(let i=0;i<num;i++){
		let start_state = random_choice(states)
		let sample = play_episode(start_state)
		samples.push(sample)
	}
	return samples
}


function evaluate(){

	// make 100 samples	
	let sampels = collect_samples(batch_size)

	// get new values from sample
	let new_values = values.slice()
	

	sampels.forEach(sample=>{ 
		
		let state = sample.start_state 
		let g = sample.reward		
		let v = get_value(state)

		// incremental mc update
		new_values[state] = v + alpha*(g-v) 

	})
	
	// update values
	states.forEach(state=>{
		values[state] = new_values[state]
	})
}

//////////////////////////////////////////////////////////////////////
// Build output
//////////////////////////////////////////////////////////////////////

function pad(str){
	while(str.length<20)
				str = str + " "
		return str
}

function print_values(phase){
	console.log(pad(`values#${phase} │`)+values.map(v=>{return pad(`${v.toFixed(2)}`)}).join(""))
}


function main(){	
	console.log(pad("States  ")+state_label.map(l=>{return pad(l)}).join(""))
	print_values(0)
	for(let i=0;i<10;i++){
		evaluate()
		print_values(i+1)
	}
}


main()