<script lang="ts">
	import { chars } from '../stores.js';
	import { onMount } from 'svelte';

	let previousChars = $chars;
	let animationClass = '';

	$: if ($chars > previousChars) {
		animationClass = 'chars-gained';
		setTimeout(() => {
			animationClass = '';
		}, 500);
		previousChars = $chars;
	}
</script>

<div class="chars-display" class:animate={animationClass}>
	<div class="chars-icon">
		<img src="/chars-icon.png" alt="chars" />
	</div>
	<div class="chars-amount">
		{$chars.toLocaleString()}
	</div>
	<div class="chars-label">Chars</div>
</div>

<style>
	.chars-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
		transition: all 0.3s ease;
		border: 2px solid #03a9f4;
	}

	.chars-display.animate {
		animation: charsGain 0.5s ease-out;
	}

	.chars-icon {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: bounce 2s ease-in-out infinite;
	}

	.chars-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.chars-amount {
		font-size: 1.3rem;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.chars-label {
		font-size: 0.9rem;
		color: #ffffff;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	@keyframes charsGain {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
			box-shadow: 0 4px 12px rgba(79, 195, 247, 0.5);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes bounce {
		0%, 100% {
			transform: scale(1) translateY(0);
		}
		50% {
			transform: scale(1.05) translateY(-2px);
		}
	}
</style> 