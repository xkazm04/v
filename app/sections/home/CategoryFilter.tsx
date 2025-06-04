'use client';

import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

// Updated categories based on backend StatementCategory enum
export const STATEMENT_CATEGORIES = [
	{
		value: 'all',
		label: 'All Categories',
		color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300',
	},
	{
		value: 'politics',
		label: 'Politics',
		color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
	},
	{
		value: 'economy',
		label: 'Economy',
		color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
	},
	{
		value: 'environment',
		label: 'Environment',
		color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
	},
	{
		value: 'military',
		label: 'Military',
		color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300',
	},
	{
		value: 'healthcare',
		label: 'Healthcare',
		color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
	},
	{
		value: 'education',
		label: 'Education',
		color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
	},
	{
		value: 'technology',
		label: 'Technology',
		color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
	},
	{
		value: 'social',
		label: 'Social',
		color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
	},
	{
		value: 'international',
		label: 'International',
		color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
	},
	{
		value: 'other',
		label: 'Other',
		color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
	},
];

interface CategoryFilterProps {
	selectedCategory?: string;
	onCategoryChange?: (category: string) => void;
	className?: string;
	showCounts?: boolean;
	counts?: Record<string, number>;
}

export function CategoryFilter({
	selectedCategory = 'all',
	onCategoryChange,
	className,
	showCounts = false,
	counts = {},
}: CategoryFilterProps) {
	const [activeCategory, setActiveCategory] = useState(selectedCategory);

	const handleCategorySelect = (category: string) => {
		setActiveCategory(category);
		onCategoryChange?.(category);
	};

	return (
		<div className={cn('w-full', className)}>
			<ScrollArea className="w-full whitespace-nowrap rounded-md">
				<div className="flex w-max space-x-2 p-1">
					{STATEMENT_CATEGORIES.map((category, index) => {
						const isActive = activeCategory === category.value;
						const count = counts[category.value] || 0;

						return (
							<motion.div
								key={category.value}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
							>
								<Button
									variant={isActive ? 'default' : 'outline'}
									size="sm"
									onClick={() => handleCategorySelect(category.value)}
									className={cn(
										'relative whitespace-nowrap transition-all duration-200',
										isActive && 'shadow-md'
									)}
								>
									<span className="flex items-center gap-2">
										{/* Category Color Indicator */}
										<div
											className={cn(
												'w-2 h-2 rounded-full',
												isActive ? 'bg-white' : category.color.split(' ')[0]
											)}
										/>
										{category.label}
										{showCounts && count > 0 && (
											<Badge
												variant="secondary"
												className="ml-1 text-xs px-1.5 py-0.5 min-w-[20px] h-5"
											>
												{count}
											</Badge>
										)}
									</span>

									{isActive && (
										<motion.div
											layoutId="category-active-indicator"
											className="absolute inset-0 rounded-md bg-primary/10 -z-10"
											transition={{ type: 'spring', stiffness: 400, damping: 30 }}
										/>
									)}
								</Button>
							</motion.div>
						);
					})}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}