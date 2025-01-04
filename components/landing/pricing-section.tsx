'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Standard',
    price: '$49',
    description: 'Perfect for small gyms getting started',
    features: [
      'Basic access control',
      'Member management',
      'Email support',
      'Basic reporting',
      '1 location',
    ],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$99',
    description: 'Ideal for growing fitness centers',
    features: [
      'Advanced access control',
      'Complete member management',
      '24/7 priority support',
      'Advanced analytics',
      'Up to 3 locations',
      'Custom branding',
    ],
    highlighted: true,
  },
  {
    name: 'Ultra',
    price: '$199',
    description: 'For large-scale gym networks',
    features: [
      'Enterprise-grade security',
      'Unlimited members',
      '24/7 dedicated support',
      'Custom analytics',
      'Unlimited locations',
      'API access',
      'Custom integration',
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your gym's needs. All plans include our
            core features with different levels of support and customization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:mx-10 max-sm:mx-3.5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'rounded-lg p-8 transition-all duration-200 hover:scale-105',
                tier.highlighted
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-card text-card-foreground border'
              )}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm">/month</span>
                </div>
                <p
                  className={cn(
                    'text-sm',
                    tier.highlighted
                      ? 'text-primary-foreground/90'
                      : 'text-muted-foreground'
                  )}
                >
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  'w-full',
                  tier.highlighted
                    ? 'bg-background text-foreground hover:bg-background/90'
                    : ''
                )}
                variant={tier.highlighted ? 'secondary' : 'default'}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
