console.log("MDP solve with Dynamic Programming")
console.log("About DP : http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching_files/DP.pdf")

var states = ['A', 'B', 'C', 'D', 'E']
var values = [0, 0, 0, 0, 0]
var actions = ["left", "right"]

var policy = {
	"A":[0.5,0.5], // initially left and right have same weights
	"B":[0.5,0.5],
	"C":[0.5,0.5],
	"D":[0.5,0.5],
	"E":[0.5,0.5]
}

var transition_probability = {
	"left":[
		[1, 0, 0, 0, 0], // move right action on state A, stay A
		[1, 0, 0, 0, 0], // move right action on state B, go A
		[0, 1, 0, 0, 0], // move right action on state C, go B
		[0, 0, 1, 0, 0], // move right action on state D, go C
		[0, 0, 0, 1, 0]  // move right action on state E, go D
	],
	"right":[	
		[0, 1, 0 ,0, 0], // move left on state A, go B
		[0, 0, 1 ,0, 0], // move left on state B, go C
		[0, 0, 0 ,1, 0], // move left on state C, go D
		[0, 0, 0 ,0, 1], // move left on state D, go E
		[0, 0, 0 ,0, 1]  // move left on state E, stay E
	]
}

var discount_ratio = 0.5
var goal = 'D'

function get_next_state(state, action){
	let state_idx = states.indexOf(state)
	let offset = action=="left"?-1:1
	let next_state_idx = Math.max(Math.min(state_idx + offset, states.length-1), 0)
	return states[next_state_idx]
}

function get_reward(state, action){
	let new_state = get_next_state(state, action)
	if(new_state == goal) //when it's goal
		return 1
	return -1
}


function get_value(state){
	let state_idx = states.indexOf(state)
	return values[state_idx]
}

function get_transition_probability(state, action, next_state){
	
	let state_idx = states.indexOf(state)
	let next_state_idx = states.indexOf(next_state)
	return transition_probability[action][state_idx][next_state_idx]
}

function update_values(new_values){
	for(let i in values){
		values[i] = new_values[i]
	}
}

function update_policy(new_policy){
	for(let state in policy){
		policy[state] = new_policy[state]
	}
}

function evaluate(phase){
	//evaluate policy
	let next_values = states.map(state=>{

		if(state == goal){
			return 0
		}else{
			let action_values = actions.map(action=>{ 							
				let reward = get_reward(state, action)			// get reward from action we took
				let value = states.map(new_state=>{				// estimate the value of each possible next states from action we took
					let p = get_transition_probability(state, action, new_state)
					let v = get_value(new_state)
					return p * v
				}).reduce((a,b)=>{ return a+b}, 0)
				return reward + value * discount_ratio
			})
			return Math.max(...action_values) // return biggest value
		}
	})

	update_values(next_values)
}

function improve(){

	let new_policy = {}

	for(let state in policy){

		if(state == goal) {
			new_policy[state] = [0, 0]
			continue
		}
		
		let values_of_each_action = actions.map(action=>{
			let reward = get_reward(state, action) // required
			let new_state = get_next_state(state, action)
			return reward+get_value(new_state)
		})

		if(values_of_each_action[0] > values_of_each_action[1])
			new_policy[state] = [1, 0] // choose left
		else if(values_of_each_action[0] < values_of_each_action[1])
			new_policy[state] = [0, 1] // choose right
		else
			new_policy[state] = [0.5, 0.5] // fifty fifty

	}

	update_policy(new_policy)
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
	let as_action = function(action_dist){
		let l = []
		for(let i in action_dist)
			if(action_dist[i] > 0) l.push(actions[i])
		return pad(l.join("|"))
	}
	let stack = []
	for(let state in policy){
		stack.push(as_action(policy[state]))
	}
	console.log(pad(`policy#${phase}`)+stack.join(""))
}

function main(){	
	console.log(pad("states")+states.map(l=>{return pad(l)}).join(""))
	console.log("----------------------------------------------------------------------------------------------------------------")
	print_values(0)
	print_policy(0)

	for(let i=0;i<5;i++){
		console.log("----------------------------------------------------------------------------------------------------------------")
		evaluate(i)
		print_values(i+1)
		improve()
		print_policy(i+1)
	}

}

main()