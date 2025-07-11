import type { Upgrade } from './types.js';

export const soundUpgrades: Upgrade[] = [
	{
		id: 'sound-typewriter',
		name: 'Typewriter',
		description: 'click click click',
		cost: 1200,
		type: 'sound',
		value: 'typewriter',
		purchased: false
	},
	{
		id: 'sound-bubble',
		name: 'Bubble Pop',
		description: 'web3, AI, whatever',
		cost: 600,
		type: 'sound',
		value: 'bubble',
		purchased: false
	},
	{
		id: 'sound-cat',
		name: 'Cat Meow (spacebar)',
		description: 'spaced repetition meowing',
		cost: 2000,
		type: 'sound',
		value: 'cat',
		purchased: false
	},
	{
		id: 'sound-silence',
		name: 'Premium Silence',
		description: 'silence is golden',
		cost: 5000,
		type: 'sound',
		value: 'silence',
		purchased: false
	}
]; 