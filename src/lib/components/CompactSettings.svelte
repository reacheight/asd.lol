<script lang="ts">
	import { upgrades, currentTheme, currentFont, currentSound, getAvailableFonts, getAvailableThemes, getAvailableSounds } from '../stores.js';
	import * as Select from "$lib/components/ui/select/index.js";

	$: availableFonts = getAvailableFonts($upgrades);
	$: availableThemes = getAvailableThemes($upgrades);
	$: availableSounds = getAvailableSounds($upgrades);

	// Derived values for trigger content
	$: fontTriggerContent = availableFonts.find((f) => f.value === $currentFont)?.name ?? "Select font";
	$: themeTriggerContent = availableThemes.find((t) => t.value === $currentTheme)?.name ?? "Select theme";
	$: soundTriggerContent = availableSounds.find((s) => s.value === $currentSound)?.name ?? "Select sound";
</script>

<div class="flex items-center gap-6 p-4 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-sm border-b">
	<!-- Font Setting -->
	<Select.Root type="single" name="currentFont" bind:value={$currentFont}>
		<Select.Trigger class="w-42">
			{fontTriggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Font Style</Select.Label>
				{#each availableFonts as font (font.value)}
					<Select.Item value={font.value} label={font.name}>
						{font.name}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

	<Select.Root type="single" name="currentTheme" bind:value={$currentTheme}>
		<Select.Trigger class="w-42">
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center w-4 h-4">
					<img src="/theme-icon.png" alt="Theme" class="w-4 h-4 object-contain" />
				</div>
				{themeTriggerContent}
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
		<Select.Trigger class="w-46">
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center w-4 h-4">
					<img src="/sound-icon.png" alt="Sound" class="w-4 h-4 object-contain" />
				</div>
				{soundTriggerContent}
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