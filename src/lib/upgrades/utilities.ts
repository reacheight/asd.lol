import type { Upgrade } from './types.js';

export const utilityUpgrades: Upgrade[] = [
	{
		id: 'utility-copy',
		name: 'Copy Button',
		description: 'unlock the ability to copy your notes',
		cost: 500,
		type: 'utility',
		value: 'copy',
		purchased: false
	},
	{
		id: 'utility-wordcount',
		name: 'Word Counter',
		description: 'see how many words you\'ve written',
		cost: 75,
		type: 'utility',
		value: 'wordcount',
		purchased: false
	},
	{
		id: 'utility-undo',
		name: 'Ctrl+Z rights',
		description: 'the ability to fix your life choices',
		cost: 400,
		type: 'utility',
		value: 'undo',
		purchased: false
	},
	{
		id: 'utility-paste',
		name: 'Ctrl+V rights',
		description: 'even your own clipboard judges you',
		cost: 200,
		type: 'utility',
		value: 'paste',
		purchased: false
	}
]; 