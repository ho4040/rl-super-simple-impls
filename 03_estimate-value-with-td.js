console.log("Estimate value function via TD")
console.log("About MC : http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching_files/MC-TD.pdf")

var state_label = ['A', 'B', 'C', 'D', 'E']
var states = [0, 1, 2, 3, 4]
var values = [0, 0, 0, 0, 0]
var policy = [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]]
var goal = 3
var learning_rate =  0.01 	//learning rate
var gamma = 0.9 // discount factor
var batch_size = 100
state_label[goal] += '(G)'

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


function one_step_look_ahead(state) {

	let actions = get_actions(state)
	let action = random_choice(actions) 
	let reward = get_reward(state, action)
	let next_state = get_next_state(state, action)
	let g = reward + get_value(next_state) * gamma
	return {"state":state, "td_target":g};	
}

function collect_samples(num) {
	let samples = []
	for(let i=0;i<num;i++){
		let state = random_choice(states)
		if(state == goal)
			continue
		let sample = one_step_look_ahead(state)
		samples.push(sample)
	}
	return samples
}


function estimate(){

	// create episode samples
	let sampels = collect_samples(batch_size)
	let new_values = values.slice() // clone old values

	// get new values from sample
	sampels.forEach(sample=>{ 
		let state = sample.state 
		let g = sample.td_target
		let v = get_value(state)				
		new_values[state] = v + learning_rate * (g-v)  // incremental mc update
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
	console.log(pad(`values#${phase}`)+values.map(v=>{return pad(`${v.toFixed(2)}`)}).join(""))
}


// print_values(0)
// estimate()
// print_values(1)
function main(){	
	console.log(pad("states  ")+state_label.map(l=>{return pad(l)}).join(""))
	print_values(0)
	for(let i=0;i<10;i++){
		estimate()
		print_values(i+1)
	}
}


main()