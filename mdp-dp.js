console.log("Deterministic MDP solve with Dynamic Programming")
console.log("About DP : http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching_files/DP.pdf")

state_label = ['A', 'B', 'C', 'D', 'E']
states = [0, 1, 2, 3, 4]

values = [0, 0, 0, 0, 0]
policy = [[-1,1], [-1,1], [-1,1], [-1,1], [-1,1]]
discount_ratio = 0.8
goal = 3
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
		let actions = get_actions(state)		
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
	while(str.length<15)
				str = str + " "
		return str
}

function print_values(phase){
	console.log(pad(`\tvalues_${phase} │\t`)+values.map(v=>{return pad(`${v.toFixed(2)}`)}).join("\t"))
}

function print_policy(phase){
	console.log(pad(`\tpolicy_${phase} │\t`)+policy.map(actions=>{
		return pad(actions.map(action=>{
			if(action == -1) return "← "
			else if(action == 1) return "→ "
			return ""
		}).join(""))
	}).join("\t"))
}

function main(){	
	console.log("──────────────────────────────────────────────────────────────────────────────────────────")
	console.log(pad("\tStates\t")+state_label.map(l=>{return pad(l)}).join("\t"))
	console.log("───────────┬──────────────────────────────────────────────────────────────────────────────")
	print_values(0)
	print_policy(0)
	for(let i=0;i<5;i++){
		console.log("───────────┼──────────────────────────────────────────────────────────────────────────────")
		evaluate()
		print_values(i+1)
		improve()
		print_policy(i+1)
	}
	console.log("───────────┴──────────────────────────────────────────────────────────────────────────────")
}


main()