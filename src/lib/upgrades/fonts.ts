import type { Upgrade } from './types.js';

export const fontUpgrades: Upgrade[] = [
	{
		id: 'font-comic',
		name: 'Comic Sans',
		description: 'we don\'t deserve you king 🥀',
		cost: 10,
		type: 'font',
		value: '"Comic Sans MS", cursive',
		purchased: false
	},
	{
		id: 'font-mono',
		name: 'Monospace',
		description: 'so you\'re like good with computers or something?',
		cost: 150,
		type: 'font',
		value: 'monospace',
		purchased: false
	},
	{
		id: 'font-system-ui',
		name: 'System Font',
		description: 'mac users can\'t survive without this',
		cost: 300,
		type: 'font',
		value: 'system-ui',
		purchased: false
	},
	{
		id: 'font-times',
		name: 'Times New Roman',
		description: 'my name\'s Roman btw',
		cost: 600,
		type: 'font',
		value: '"Times New Roman", Times, serif',
		purchased: false
	},
	{
		id: 'font-courier',
		name: 'Courier New',
		description: 'for when you miss the 80s',
		cost: 900,
		type: 'font',
		value: '"Courier New", Courier, monospace',
		purchased: false
	},
	{
		id: 'font-impact',
		name: 'Impact',
		description: 'SCREAM AT YOUR READERS',
		cost: 1200,
		type: 'font',
		value: 'Impact, Arial Black, sans-serif',
		purchased: false
	}
]; 