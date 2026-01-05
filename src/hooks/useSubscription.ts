import { useState, useEffect } from 'react';
import { getUserInfo } from '@/utils/api';

export type SubscriptionTier = 'free' | 'premium';

export interface Subscription {
  tier: SubscriptionTier;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    trialEndsAt: null,
    subscriptionEndsAt: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mizan_token');
    if (token) {
      getUserInfo()
        .then((info) => {
          setSubscription(info.subscription || { tier: 'free', trialEndsAt: null, subscriptionEndsAt: null });
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const isPremium = subscription.tier === 'premium' && 
    (!subscription.subscriptionEndsAt || new Date(subscription.subscriptionEndsAt) > new Date());
  const isTrial = subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date();
  const isExpired = subscription.subscriptionEndsAt && new Date(subscription.subscriptionEndsAt) < new Date();

  return {
    subscription,
    isPremium,
    isTrial,
    isExpired,
    isLoading
  };
}
