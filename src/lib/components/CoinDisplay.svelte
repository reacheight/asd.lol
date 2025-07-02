<script lang="ts">
	import { chars } from '../stores.js';

	let previousChars = $chars;
	let animationClass = '';

	$: if ($chars > previousChars) {
		animationClass = 'coin-gain';
		setTimeout(() => {
			animationClass = '';
		}, 500);
		previousChars = $chars;
	}
</script>

<div class="coin-display {animationClass}">
	<div class="coin-icon">
		<img src="/chars-icon.png" alt="chars" />
	</div>
	<div class="coin-content">
		<div class="coin-amount">
			{$chars.toLocaleString()}
		</div>
		<div class="coin-label">
			Chars
		</div>
	</div>
</div>

<style>
	.coin-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, var(--coin-bg), color-mix(in oklch, var(--coin-bg), transparent 20%));
		backdrop-filter: blur(20px);
		border: 1px solid var(--coin-border);
		border-radius: 16px;
		box-shadow: 0 8px 32px var(--coin-shadow);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.coin-display::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		transition: left 0.6s ease;
	}

	.coin-display:hover::before {
		left: 100%;
	}

	.coin-display:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px var(--coin-shadow);
		border-color: color-mix(in oklch, var(--coin-border), transparent 40%);
	}

	.coin-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: coinFloat 3s ease-in-out infinite;
	}

	.coin-icon img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		filter: brightness(1.1) contrast(1.1) drop-shadow(0 2px 4px var(--coin-shadow));
	}

	.coin-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.coin-amount {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--coin-text);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		line-height: 1;
	}

	.coin-label {
		font-size: 0.75rem;
		color: color-mix(in oklch, var(--coin-text), transparent 20%);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		line-height: 1;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.coin-display {
			padding: 0.625rem 1rem;
			gap: 0.5rem;
		}
		
		.coin-icon img {
			width: 28px;
			height: 28px;
		}
		
		.coin-amount {
			font-size: 1.2rem;
		}
		
		.coin-label {
			font-size: 0.7rem;
		}
	}
</style> 