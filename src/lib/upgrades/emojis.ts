import type { Upgrade } from './types.js';

export const emojiUpgrades: Upgrade[] = [
	{
		id: 'emoji-classic',
		name: 'Classic',
		description: ':) :(',
		cost: 100,
		type: 'emoji',
		value: 'classic',
		purchased: false
	},
	{
		id: 'emoji-advanced',
		name: 'Nobody actually uses these',
		description: ':O',
		cost: 250,
		type: 'emoji',
		value: 'advanced',
		purchased: false
	},
	{
		id: 'emoji-love',
		name: 'Love & Hearts',
		description: '<3 you xoxo',
		cost: 600,
		type: 'emoji',
		value: 'love',
		purchased: false
	},
	{
		id: 'emoji-memes',
		name: 'You\'ve seen these',
		description: '¯\\_(ツ)_/¯',
		cost: 1200,
		type: 'emoji',
		value: 'memes',
		purchased: false
	},
	{
		id: 'emoji-russian',
		name: 'Russian Special',
		description: '))',
		cost: 400,
		type: 'emoji',
		value: 'russian',
		purchased: false
	}
];

export const emojiPacks = {
	classic: [
		{ emoji: ':)', title: 'Happy' },
		{ emoji: ':(', title: 'Sad' },
	],
	advanced: [
		{ emoji: ';)', title: 'Wink' },
		{ emoji: ':P', title: 'Tongue' },
		{ emoji: ':/', title: 'Neutral' },
		{ emoji: ':O', title: 'Surprised' },
		{ emoji: ':D', title: 'Grin' }
	],
	love: [
		{ emoji: '<3', title: 'Heart' },
		{ emoji: '</3', title: 'Broken Heart' },
		{ emoji: 'xoxo', title: 'Hugs and Kisses' },
		{ emoji: ':-*', title: 'Kiss' },
		{ emoji: ':3', title: 'idk' }
	],
	memes: [
		{ emoji: '¯\\_(ツ)_/¯', title: 'Shrug' },
		{ emoji: '(╯°□°）╯︵ ┻━┻', title: 'Table Flip' },
		{ emoji: '┬─┬ ノ( ゜-゜ノ)', title: 'Table Unflip' },
		{ emoji: '( ͡° ͜ʖ ͡°)', title: 'Lenny Face' },
		{ emoji: 'ಠ_ಠ', title: 'Disapproval' }
	],
	russian: [
		{ emoji: ')', title: ')' },
		{ emoji: '))', title: '))' },
		{ emoji: '(', title: '(' },
		{ emoji: '((', title: '((' },
	]
}; 