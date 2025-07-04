<script lang="ts">
	import { upgrades, chars, purchaseUpgrade } from '../stores.js';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { Store } from 'lucide-svelte';

	let selectedCategory: string = 'all';
	let isCollapsed = false;
	
	// Track which upgrades just became affordable
	let newlyAffordable = new Set<string>();
	let previousAffordabilityState = new Map<string, boolean>();
	
	const categories = [
		{ id: 'all', name: 'All', icon: 'text', label: 'All' },
		{ id: 'font', name: 'Fonts', icon: '/font-icon.png', label: 'Font' },
		{ id: 'theme', name: 'Themes', icon: '/theme-icon.png', label: 'Theme' },
		{ id: 'sound', name: 'Sounds', icon: '/sound-icon.png', label: 'Sound' },
		{ id: 'emoji', name: 'Emojis', icon: 'text', label: '( ͡° ͜ʖ ͡°)' }
	];

	$: filteredUpgrades = $upgrades.filter(upgrade => 
		selectedCategory === 'all' || upgrade.type === selectedCategory
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
			default: return { type: 'text', value: 'Item' };
		}
	}
</script>

<div class={cn(
	"flex flex-col h-full bg-muted/30 border-r transition-all duration-300 ease-in-out",
	isCollapsed ? "w-16" : "w-72"
)}>
	<div class="flex items-center justify-between px-4 pt-4 pb-2 bg-background">
		<div class="flex items-center gap-3">
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 shrink-0"
				onclick={() => isCollapsed = !isCollapsed}
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
		<div class="flex flex-wrap gap-2 p-3 border-b bg-background">
			{#each categories as category}
				<Button
					variant={selectedCategory === category.id ? "default" : "outline"}
					size="sm"
					class="h-8 px-3 text-xs"
					onclick={() => selectedCategory = category.id}
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

		<div class="flex-1 overflow-y-auto p-3 space-y-4">
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
										<div class="flex items-center justify-center w-8 h-8 bg-muted rounded-lg shrink-0">
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
										<div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg shrink-0">
											{#if getUpgradeIcon(upgrade.type).type === 'image'}
												<img 
													src={getUpgradeIcon(upgrade.type).value} 
													alt={upgrade.type} 
													class="w-4 h-4 object-contain"
												/>
											{:else}
												<span class="text-xs font-medium text-green-700">
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

			{#if filteredUpgrades.length === 0}
				<div class="flex flex-col items-center justify-center h-32 text-center">
					<div class="text-muted-foreground space-y-1">
						<p class="text-sm font-medium">No items found</p>
						<p class="text-xs">Try selecting a different category</p>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.compact-shop {
		width: 280px;
		height: 100%;
		background: var(--sidebar-bg, #f8f9fa);
		border-right: 2px solid var(--border-color, #e5e5e5);
		display: flex;
		flex-direction: column;
		transition: width 0.3s ease;
		overflow: hidden;
	}

	.compact-shop.collapsed {
		width: 50px;
	}

	.shop-header {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		background: var(--header-bg, #fff);
		gap: 0.5rem;
	}

	.collapse-btn {
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
		position: relative;
		overflow: hidden;
	}

	.collapse-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.2), 
			transparent
		);
		transition: left 0.5s ease;
	}

	.collapse-btn:hover::before {
		left: 100%;
	}

	.collapse-btn:hover {
		background: linear-gradient(135deg, #29b6f6, #1e88e5);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
	}

	.collapse-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(79, 195, 247, 0.3);
	}

	.shop-header h3 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-color, #333);
		font-weight: 600;
	}

	.category-filter {
		display: flex;
		padding: 0.5rem;
		gap: 0.25rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		background: var(--header-bg, #fff);
		flex-wrap: wrap;
	}

	.category-btn {
		padding: 0.5rem 0.75rem;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.9), 
			rgba(248, 249, 250, 0.8)
		);
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex: 1;
		min-width: 45px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		position: relative;
		overflow: hidden;
	}

	.category-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.category-btn:hover {
		border-color: rgba(79, 195, 247, 0.3);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.category-btn:hover::before {
		opacity: 0.1;
	}

	.category-btn.active {
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border-color: #29b6f6;
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
	}

	.category-icon {
		width: 16px;
		height: 16px;
		object-fit: contain;
		transition: all 0.3s ease;
	}

	.category-text {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.shop-content {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.upgrades-section {
		margin-bottom: 1rem;
	}

	.upgrades-section h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: var(--muted-color, #666);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0 0.5rem;
	}

	.upgrade-card.compact {
		background: var(--card-bg, #fff);
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 8px;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		transition: all 0.2s;
	}

	.upgrade-card.compact:hover {
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 2px 6px rgba(0, 122, 204, 0.1);
	}

	.upgrade-card.compact.purchased {
		border-color: var(--success-color, #28a745);
		background: var(--success-bg, #f8fff9);
	}

	.upgrade-header {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		align-items: flex-start;
	}

	.upgrade-icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
		flex-shrink: 0;
	}

	.upgrade-text-icon {
		background: var(--accent-color, #007acc);
		color: white;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 500;
		flex-shrink: 0;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
	}

	.upgrade-info {
		flex: 1;
		min-width: 0;
	}

	.upgrade-info h5 {
		margin: 0 0 0.25rem 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-color, #333);
		line-height: 1.2;
	}

	.upgrade-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--muted-color, #666);
		line-height: 1.3;
	}

	.upgrade-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.upgrade-cost {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--accent-color, #007acc);
	}

	.purchase-btn.compact {
		padding: 0.4rem 0.8rem;
		background: linear-gradient(135deg, #4fc3f7, #29b6f6);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
		box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
		position: relative;
		overflow: hidden;
	}

	.purchase-btn.compact::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255, 255, 255, 0.2), 
			transparent
		);
		transition: left 0.5s ease;
	}

	.purchase-btn.compact:hover:not(.disabled)::before {
		left: 100%;
	}

	.purchase-btn.compact:hover:not(.disabled) {
		background: linear-gradient(135deg, #29b6f6, #1e88e5);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
	}

	.purchase-btn.compact:active:not(.disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(79, 195, 247, 0.3);
	}

	.purchase-btn.compact.disabled {
		background: linear-gradient(135deg, #e0e0e0, #bdbdbd);
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.purchase-btn.compact.disabled::before {
		display: none;
	}

	.owned-badge {
		background: var(--success-color, #28a745);
		color: white;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.empty-category {
		text-align: center;
		padding: 1rem;
		color: var(--muted-color, #666);
		font-size: 0.8rem;
	}

	/* Newly Affordable Animation */
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

	/* Responsive */
	@media (max-width: 768px) {
		.compact-shop {
			width: 100%;
			height: auto;
			border-right: none;
			border-bottom: 2px solid var(--border-color, #e5e5e5);
		}

		.compact-shop.collapsed {
			width: 100%;
		}

		.shop-content {
			max-height: 200px;
		}
	}
</style> 