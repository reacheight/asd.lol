<script lang="ts">
	import { chars } from '../stores.js';

	let previousChars = $chars;
	let animationClass = '';

	$: if ($chars > previousChars) {
		animationClass = 'animate-pulse';
		setTimeout(() => {
			animationClass = '';
		}, 500);
		previousChars = $chars;
	}
</script>

<div class="flex items-center gap-3 p-3 px-5 backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-0.5 hover:shadow-3xl group coin-display-themed {animationClass}">
	<div class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-600 ease-out group-hover:left-full"></div>
	
	<div class="flex items-center justify-center animate-float">
		<img 
			src="/chars-icon.png" 
			alt="chars" 
			class="w-8 h-8 md:w-7 md:h-7 object-contain brightness-110 contrast-110 drop-shadow-lg"
		/>
	</div>
	
	<div class="flex flex-col gap-0.5">
		<div class="text-2xl md:text-xl font-bold drop-shadow-sm leading-none coin-amount-text">
			{$chars.toLocaleString()}
		</div>
		<div class="text-xs md:text-[0.7rem] font-semibold uppercase tracking-wider leading-none coin-label-text">
			Chars
		</div>
	</div>
</div>

<style>
	.coin-display-themed {
		background: linear-gradient(135deg, var(--coin-bg), color-mix(in oklch, var(--coin-bg), transparent 20%));
		border-color: var(--coin-border);
		box-shadow: 0 8px 32px var(--coin-shadow);
	}
	
	.coin-display-themed:hover {
		box-shadow: 0 12px 40px var(--coin-shadow);
		border-color: color-mix(in oklch, var(--coin-border), transparent 40%);
	}
	
	.coin-amount-text {
		color: var(--coin-text);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	
	.coin-label-text {
		color: color-mix(in oklch, var(--coin-text), transparent 20%);
	}

	@keyframes coinFloat {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-4px); }
	}
	
	.animate-float {
		animation: coinFloat 3s ease-in-out infinite;
	}
</style> 