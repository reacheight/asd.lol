import type { Upgrade } from './types.js';

export const themeUpgrades: Upgrade[] = [
	{
		id: 'theme-dark',
		name: 'Dark',
		description: 'I won\'t pay for your eyes treatment',
		cost: 300,
		type: 'theme',
		value: 'dark',
		purchased: false
	},
	{
		id: 'theme-purple',
		name: 'Purple',
		description: 'for real men',
		cost: 500,
		type: 'theme',
		value: 'purple',
		purchased: false
	},
	{
		id: 'theme-ocean',
		name: 'Ocean Breeze',
		description: 'the only you can afford',
		cost: 700,
		type: 'theme',
		value: 'ocean',
		purchased: false
	},
	{
		id: 'theme-forest',
		name: 'Forest Zen',
		description: 'embrace your inner tree hugger',
		cost: 1000,
		type: 'theme',
		value: 'forest',
		purchased: false
	},
	{
		id: 'theme-rose',
		name: 'Rose Garden',
		description: 'for real men 2',
		cost: 1500,
		type: 'theme',
		value: 'rose',
		purchased: false
	}
]; 