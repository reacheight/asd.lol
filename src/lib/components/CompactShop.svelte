<script lang="ts">
	import { upgrades, chars, purchaseUpgrade, selectedShopCategory, shopCollapsed } from '../stores.js';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { Store } from 'lucide-svelte';

	$: isCollapsed = $shopCollapsed;
	
	// Track which upgrades just became affordable
	let newlyAffordable = new Set<string>();
	let previousAffordabilityState = new Map<string, boolean>();
	
	const categories = [
		{ id: 'all', name: 'All', icon: 'text', label: 'All' },
		{ id: 'font', name: 'Fonts', icon: '/font-icon.png', label: 'Font' },
		{ id: 'theme', name: 'Themes', icon: '/theme-icon.png', label: 'Theme' },
		{ id: 'sound', name: 'Sounds', icon: '/sound-icon.png', label: 'Sound' },
		{ id: 'emoji', name: 'Emojis', icon: 'text', label: '( ͡° ͜ʖ ͡°)' },
		{ id: 'utility', name: 'Utilities', icon: '/utils-icon.png', label: 'Pay to work' },
		{ id: 'nothing', name: 'Nothing', icon: '/nothing-icon.png', label: 'Nothing' }
	];

	$: filteredUpgrades = $upgrades.filter(upgrade => 
		$selectedShopCategory === 'all' || upgrade.type === $selectedShopCategory
	);

	$: availableUpgrades = filteredUpgrades
		.filter(upgrade => !upgrade.purchased)
		.sort((a, b) => a.cost - b.cost);
	$: purchasedUpgrades = filteredUpgrades
		.filter(upgrade => upgrade.purchased)
		.sort((a, b) => a.cost - b.cost);

	// Track affordability changes and trigger animations
	$: {
		const currentAffordabilityState = new Map<string, boolean>();
		
		availableUpgrades.forEach(upgrade => {
			const isAffordable = $chars >= upgrade.cost;
			const wasAffordable = previousAffordabilityState.get(upgrade.id) ?? false;
			
			currentAffordabilityState.set(upgrade.id, isAffordable);
			
			if (isAffordable && !wasAffordable && previousAffordabilityState.size > 0) {
				newlyAffordable.add(upgrade.id);
				
				setTimeout(() => {
					newlyAffordable.delete(upgrade.id);
					newlyAffordable = new Set(newlyAffordable);
				}, 1200);
			}
		});
		
		previousAffordabilityState = currentAffordabilityState;
		newlyAffordable = new Set(newlyAffordable);
	}

	function handlePurchase(upgradeId: string) {
		const success = purchaseUpgrade(upgradeId);
		if (success) {
			console.log('Upgrade purchased successfully!');
		} else {
			console.log('Not enough chars!');
		}
	}

	function getUpgradeIcon(type: string): { type: 'image' | 'text', value: string } {
		switch (type) {
			case 'font': return { type: 'image', value: '/font-icon.png' };
			case 'theme': return { type: 'image', value: '/theme-icon.png' };
			case 'sound': return { type: 'image', value: '/sound-icon.png' };
			case 'emoji': return { type: 'text', value: '( ͡° ͜ʖ ͡°)' };
			case 'utility': return { type: 'image', value: '/utils-icon.png' };
			case 'nothing': return { type: 'image', value: '/nothing-icon.png' };
			default: return { type: 'text', value: 'Item' };
		}
	}
</script>

<div class={cn(
	"flex flex-col h-full bg-muted/30 transition-all duration-300 ease-in-out",
	"lg:border-r",
	isCollapsed ? "w-full lg:w-16" : "w-full lg:w-72"
)}>
	<div class={cn(
		"flex items-center p-2 lg:p-4 bg-background",
		isCollapsed ? "justify-center" : "justify-between"
	)}>
		<div class="flex items-center gap-3">
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 shrink-0"
				onclick={() => shopCollapsed.set(!isCollapsed)}
				title={isCollapsed ? 'Expand Shop' : 'Collapse Shop'}
			>
				<Store class="h-5 w-5 text-primary" />
			</Button>
			{#if !isCollapsed}
				<h3 class="text-lg font-semibold text-foreground">Shop</h3>
			{/if}
		</div>
	</div>

	{#if !isCollapsed}
		<!-- Categories: responsive -->
		<div class="p-2 lg:p-3 border-b bg-background">
			<div class="flex flex-wrap gap-2">
				{#each categories as category}
					<Button
						variant={$selectedShopCategory === category.id ? "default" : "outline"}
						size="sm"
						class="h-7 px-2 text-xs sm:h-8 sm:px-3"
						onclick={() => selectedShopCategory.set(category.id)}
						title={category.name}
					>
						{#if category.icon === 'text'}
							<span>{category.label}</span>
						{:else}
							<img src={category.icon} alt={category.name} class="w-3 h-3 mr-1" />
							<span class="hidden sm:inline">{category.label}</span>
						{/if}
					</Button>
				{/each}
			</div>
		</div>

		<!-- Upgrades List -->
		<div class="flex-1 overflow-y-auto p-3 space-y-4">
			<!-- Available Upgrades -->
			{#if availableUpgrades.length > 0}
				<div class="space-y-2">
					<h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
						Available
					</h4>
					<div class="space-y-2">
						{#each availableUpgrades as upgrade (upgrade.id)}
							<Card class={cn(
								"p-0 hover:shadow-md transition-shadow",
								newlyAffordable.has(upgrade.id) && "newly-affordable"
							)}>
								<CardContent class="p-3">
									<div class="flex items-start gap-3">
										<div class="flex items-center justify-center w-10 h-10 bg-muted rounded-lg shrink-0">
											{#if getUpgradeIcon(upgrade.type).type === 'image'}
												<img 
													src={getUpgradeIcon(upgrade.type).value} 
													alt={upgrade.type} 
													class="w-5 h-5 object-contain"
												/>
											{:else}
												<span class="text-xs font-medium">
													{getUpgradeIcon(upgrade.type).value}
												</span>
											{/if}
										</div>
										<div class="flex-1 min-w-0">
											<h5 class="font-medium text-sm text-foreground line-clamp-1">
												{upgrade.name}
											</h5>
											<p class="text-xs text-muted-foreground line-clamp-2 mt-1">
												{upgrade.description}
											</p>
											<div class="flex items-center justify-between mt-3">
												<Badge variant="secondary" class="text-xs">
													{upgrade.cost} chars
												</Badge>
												<Button
													size="sm"
													class="h-7 px-3 text-xs"
													disabled={$chars < upgrade.cost}
													onclick={() => handlePurchase(upgrade.id)}
												>
													{$chars >= upgrade.cost ? 'Buy' : 'Need More'}
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Purchased Upgrades -->
			{#if purchasedUpgrades.length > 0}
				{#if availableUpgrades.length > 0}
					<Separator />
				{/if}
				<div class="space-y-2">
					<h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
						Owned
					</h4>
					<div class="space-y-2">
						{#each purchasedUpgrades as upgrade (upgrade.id)}
							<Card class="p-0 bg-green-50/50 border-green-200">
								<CardContent class="p-3">
									<div class="flex items-center gap-3">
										<div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg shrink-0">
											{#if getUpgradeIcon(upgrade.type).type === 'image'}
												<img 
													src={getUpgradeIcon(upgrade.type).value} 
													alt={upgrade.type} 
													class="w-4 h-4 object-contain"
												/>
											{:else}
												<span class="text-xs font-medium">
													{getUpgradeIcon(upgrade.type).value}
												</span>
											{/if}
										</div>
										
										<div class="flex-1 min-w-0">
											<h5 class="font-medium text-sm text-foreground">
												{upgrade.name}
											</h5>
										</div>
										
										<Badge variant="secondary" class="bg-green-100 text-green-800 text-xs">
											Owned
										</Badge>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Empty State -->
			{#if availableUpgrades.length === 0 && purchasedUpgrades.length === 0}
				<div class="flex items-center justify-center h-full text-center py-10">
					<p class="text-muted-foreground">No items in this category.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(.newly-affordable) {
		animation: affordableBounce 1.2s ease-out;
		border-color: #10b981 !important;
	}

	@keyframes affordableBounce {
		0% {
			transform: translateY(0) scale(1);
		}
		15% {
			transform: translateY(-12px) scale(1.05);
		}
		30% {
			transform: translateY(0) scale(1);
		}
		45% {
			transform: translateY(-6px) scale(1.02);
		}
		60% {
			transform: translateY(0) scale(1);
		}
		75% {
			transform: translateY(-3px) scale(1.01);
		}
		90% {
			transform: translateY(0) scale(1);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
</style> 