import type { Upgrade } from './types.js';

export const utilityUpgrades: Upgrade[] = [
	{
		id: 'utility-copy',
		name: 'Copy Button',
		description: 'unlock the ability to copy your notes',
		cost: 200,
		type: 'utility',
		value: 'copy',
		purchased: false
	},
	{
		id: 'utility-wordcount',
		name: 'Word Counter',
		description: 'see how many words you\'ve written',
		cost: 400,
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
		cost: 400,
		type: 'utility',
		value: 'paste',
		purchased: false
	},
	{
		id: 'utility-tab',
		name: 'Tab Indentation',
		description: 'press Tab to insert 4 spaces like a civilized person',
		cost: 300,
		type: 'utility',
		value: 'tab',
		purchased: false
	},
	{
		id: 'utility-markdown',
		name: 'Markdown Preview',
		description: 'see your notes rendered as beautiful markdown',
		cost: 2000,
		type: 'utility',
		value: 'markdown',
		purchased: false
	}
]; 