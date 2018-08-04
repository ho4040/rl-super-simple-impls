console.log("MDP solve with Dynamic Programming")
console.log("About DP : http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching_files/DP.pdf")
console.log("Deterministic transition. no transition probability")
var state_label = ['A', 'B', 'C', 'D', 'E']
var states = [0, 1, 2, 3, 4]
var values = [0, 0, 0, 0, 0]
var policy = [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]]

var discount_ratio = 0.8
var goal = 3
state_label[goal] += '(G)'

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


function evaluate(){
	
	//evaluate policy
	let new_values = states.map(state=>{
		
		let actions = get_actions(state)
		let new_value = 0

		actions.forEach(action=>{
			let reward = get_reward(state, action)
			let new_state = get_next_state(state, action) // Deterministic transition.
			let value = get_value(new_state)
			new_value  += reward + value*discount_ratio
		})
		return new_value
	})

	// update values
	states.forEach(state=>{
		values[state] = new_values[state]
	})
}

function improve(){

	let new_policy = states.map(state=>{

		let actions = [-1, 1]
		if (state == goal)
			actions = []


		let action_values = actions.map(action=>{
			let reward = get_reward(state, action) // required
			let new_state = get_next_state(state, action)			
			return reward + discount_ratio * get_value(new_state)
		})

		// greedily choose actions
		let new_actions = []
		let biggest = Math.max(...action_values)
		for(let i=0;i<actions.length;i++){
			if(action_values[i] == biggest)
				new_actions.push(actions[i])
		}

		return new_actions
	})

	// update policy
	states.forEach(state=>{
		policy[state] = new_policy[state]
	})
}



////////////////////////////////////
// build output
////////////////////////////////////
function pad(str){
	while(str.length<20)
				str = str + " "
		return str
}

function print_values(phase){
	console.log(pad(`values#${phase}`)+values.map(v=>{return pad(`${v.toFixed(2)}`)}).join(""))
}

function print_policy(phase){
	console.log(pad(`policy#${phase}`)+policy.map(actions=>{
		return pad(actions.map(action=>{
			if(action == -1) return "←"
			else if(action == 1) return "→"
			return ""
		}).join(""))
	}).join(""))
}

function main(){	
	console.log(pad("states")+state_label.map(l=>{return pad(l)}).join(""))
	print_values(0)
	print_policy(0)
	for(let i=0;i<5;i++){
		evaluate()
		print_values(i+1)
		improve()
		print_policy(i+1)
	}
}


main()