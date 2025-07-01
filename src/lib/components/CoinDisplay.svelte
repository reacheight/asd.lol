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
	<div class="chars-content">
		<div class="chars-amount">
			{$chars.toLocaleString()}
		</div>
		<div class="chars-label">Chars</div>
	</div>
</div>

<style>
	.chars-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, 
			rgba(79, 195, 247, 0.15), 
			rgba(41, 182, 246, 0.25)
		);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(79, 195, 247, 0.3);
		border-radius: 16px;
		box-shadow: 
			0 8px 32px rgba(79, 195, 247, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.chars-display::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.1), 
			transparent
		);
		transition: left 0.6s ease;
	}

	.chars-display:hover::before {
		left: 100%;
	}

	.chars-display:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 12px 40px rgba(79, 195, 247, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		border-color: rgba(79, 195, 247, 0.4);
	}

	.chars-display.animate {
		animation: charsGain 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.chars-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
		animation: iconFloat 3s ease-in-out infinite;
	}

	.chars-icon img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		filter: brightness(1.1) contrast(1.1);
	}

	.chars-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.chars-amount {
		font-size: 1.4rem;
		font-weight: 700;
		color: #1565c0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		line-height: 1;
	}

	.chars-label {
		font-size: 0.75rem;
		color: #1976d2;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		opacity: 0.8;
		line-height: 1;
	}

	@keyframes charsGain {
		0% {
			transform: scale(1) translateY(0);
		}
		30% {
			transform: scale(1.05) translateY(-3px);
		}
		100% {
			transform: scale(1) translateY(0);
		}
	}

	@keyframes iconFloat {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		33% {
			transform: translateY(-2px) rotate(1deg);
		}
		66% {
			transform: translateY(1px) rotate(-1deg);
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.chars-display {
			padding: 0.625rem 1rem;
			gap: 0.5rem;
		}

		.chars-icon {
			width: 28px;
			height: 28px;
		}

		.chars-icon img {
			width: 18px;
			height: 18px;
		}

		.chars-amount {
			font-size: 1.2rem;
		}

		.chars-label {
			font-size: 0.7rem;
		}
	}
</style> 