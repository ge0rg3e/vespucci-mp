// Monologue
const monologue = {
	id: 'introduction',
	heading: 'Big Smoke',
	type: 'monologue',
	contents: [
		"Growing up in the heart of Los Santos, you see things change, CJ. The streets that raised us don't stay the same forever.",
		"The game's ruthless, and you gotta be willing to adapt, evolve. It's survival out here.",
		"But remember, family's everything. No matter how crazy it gets, Grove Street is home, and we ride together through thick and thin."
	]
};

// Interaction
const interaction = {
	id: 'introduction',
	heading: 'Big Smoke',
	type: 'interaction',
	contents: [
		'CJ, my man, in this chaotic city, you gotta decide - are you gonna stay true to Grove Street, stand by your homies, and ride through the storm, or are you thinking of venturing into the unknown, carving your own path, and facing whatever challenges come your way alone?'
	],
	options: [
		{
			text: "I'm ride or die, Smoke. Grove Street for life!",
			id: 'yes'
		},
		{
			text: "It's time for me to go solo, Smoke. Gotta explore on my own.",
			id: 'no'
		}
	]
};

const defaultResponse = window.location.href.includes('monologue') ? monologue : interaction;

export default defaultResponse;
