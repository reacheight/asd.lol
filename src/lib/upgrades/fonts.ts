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
		cost: 100,
		type: 'font',
		value: 'monospace',
		purchased: false
	},
	{
		id: 'font-system-ui',
		name: 'System Font',
		description: 'mac users can\'t survive without this',
		cost: 90,
		type: 'font',
		value: 'system-ui',
		purchased: false
	},
	{
		id: 'font-times',
		name: 'Times New Roman',
		description: 'Traditional newspaper and book font',
		cost: 110,
		type: 'font',
		value: '"Times New Roman", Times, serif',
		purchased: false
	},
	{
		id: 'font-courier',
		name: 'Courier New',
		description: 'Typewriter-style monospace font',
		cost: 130,
		type: 'font',
		value: '"Courier New", Courier, monospace',
		purchased: false
	},
	{
		id: 'font-impact',
		name: 'Impact',
		description: 'Bold, attention-grabbing display font',
		cost: 170,
		type: 'font',
		value: 'Impact, Arial Black, sans-serif',
		purchased: false
	}
]; 