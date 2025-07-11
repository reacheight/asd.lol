<script lang="ts">
	import { upgrades, currentTheme, currentFont, currentSound, getAvailableFonts, getAvailableThemes, getAvailableSounds } from '../stores.js';
	import * as Select from "$lib/components/ui/select/index.js";
	import { cn } from '$lib/utils';

	$: availableFonts = getAvailableFonts($upgrades);
	$: availableThemes = getAvailableThemes($upgrades);
	$: availableSounds = getAvailableSounds($upgrades);

	// Derived values for trigger content
	$: fontTriggerContent = availableFonts.find((f) => f.value === $currentFont)?.name ?? "Select font";
	$: themeTriggerContent = availableThemes.find((t) => t.value === $currentTheme)?.name ?? "Select theme";
	$: soundTriggerContent = availableSounds.find((s) => s.value === $currentSound)?.name ?? "Select sound";

	// Track when new options become available
	let newlyAvailableSelectors = new Set<string>();
	let previousCounts = { fonts: 0, themes: 0, sounds: 0 };

	// Track when new upgrades are purchased and animate corresponding selectors
	$: {
		const currentCounts = {
			fonts: availableFonts.length,
			themes: availableThemes.length,
			sounds: availableSounds.length
		};

		// Check if new fonts became available
		if (currentCounts.fonts > previousCounts.fonts && previousCounts.fonts > 0) {
			newlyAvailableSelectors.add('font');
			setTimeout(() => {
				newlyAvailableSelectors.delete('font');
				newlyAvailableSelectors = new Set(newlyAvailableSelectors);
			}, 4000);
		}

		// Check if new themes became available
		if (currentCounts.themes > previousCounts.themes && previousCounts.themes > 0) {
			newlyAvailableSelectors.add('theme');
			setTimeout(() => {
				newlyAvailableSelectors.delete('theme');
				newlyAvailableSelectors = new Set(newlyAvailableSelectors);
			}, 4000);
		}

		// Check if new sounds became available
		if (currentCounts.sounds > previousCounts.sounds && previousCounts.sounds > 0) {
			newlyAvailableSelectors.add('sound');
			setTimeout(() => {
				newlyAvailableSelectors.delete('sound');
				newlyAvailableSelectors = new Set(newlyAvailableSelectors);
			}, 4000);
		}

		previousCounts = currentCounts;
		newlyAvailableSelectors = new Set(newlyAvailableSelectors);
	}
</script>

<div class="flex flex-wrap items-center gap-2 sm:gap-4 px-2 py-2 sm:px-4 bg-background/95 backdrop-blur-sm border-b">
	<!-- Font Setting -->
	<Select.Root type="single" name="currentFont" bind:value={$currentFont}>
		<Select.Trigger class={cn(
			"w-full sm:w-50 flex-1 sm:flex-none",
			newlyAvailableSelectors.has('font') && "newly-available-selector"
		)}>
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center w-4 h-4">
					<img src="/font-icon.png" alt="Font" class="w-4 h-4 object-contain" />
				</div>
				<span 
					class="font-preview truncate" 
					style="--font-family: {$currentFont};"
				>
					{fontTriggerContent}
				</span>
			</div>

		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Font Style</Select.Label>
				{#each availableFonts as font (font.value)}
					<Select.Item value={font.value} label={font.name}>
						<span 
							class="font-preview" 
							style="--font-family: {font.value};"
						>
							{font.name}
						</span>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Select.Root type="single" name="currentTheme" bind:value={$currentTheme}>
		<Select.Trigger class={cn(
			"w-full sm:w-50 flex-1 sm:flex-none",
			newlyAvailableSelectors.has('theme') && "newly-available-selector"
		)}>
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center w-4 h-4">
					<img src="/theme-icon.png" alt="Theme" class="w-4 h-4 object-contain" />
				</div>
				<span class="truncate">{themeTriggerContent}</span>
			</div>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Theme</Select.Label>
				{#each availableThemes as theme (theme.value)}
					<Select.Item value={theme.value} label={theme.name}>
						{theme.name}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Select.Root type="single" name="currentSound" bind:value={$currentSound}>
		<Select.Trigger class={cn(
			"w-full sm:w-54 flex-1 sm:flex-none",
			newlyAvailableSelectors.has('sound') && "newly-available-selector"
		)}>
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center w-4 h-4">
					<img src="/sound-icon.png" alt="Sound" class="w-4 h-4 object-contain" />
				</div>
				<span class="truncate">{soundTriggerContent}</span>
			</div>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Typing Sounds</Select.Label>
				{#each availableSounds as sound (sound.value)}
					<Select.Item value={sound.value} label={sound.name}>
						{sound.name}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>

<style>
	.font-preview {
		font-family: var(--font-family);
	}

	/* Newly Available Selector Animation - Longer and more persistent */
	:global(.newly-available-selector) {
		animation: selectorAttention 4s ease-in-out;
		border-color: #10b981 !important;
	}

	@keyframes selectorAttention {
		0% {
			transform: translateY(0) scale(1);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
		}
		5% {
			transform: translateY(-8px) scale(1.03);
			box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
		}
		10% {
			transform: translateY(0) scale(1);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2);
		}
		15% {
			transform: translateY(-4px) scale(1.02);
			box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
		}
		20% {
			transform: translateY(0) scale(1);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.1);
		}
		25% {
			transform: translateY(-2px) scale(1.01);
			box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2);
		}
		30% {
			transform: translateY(0) scale(1);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.1);
		}
		/* Gentle pulsing for the remaining time */
		50% {
			box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
		}
		70% {
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.05);
		}
		85% {
			box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
		}
		100% {
			transform: translateY(0) scale(1);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
		}
	}
</style>