import { updateSubscription } from './api';

export async function activatePremium(userId: number): Promise<void> {
  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  await updateSubscription({
    tier: 'premium',
    subscriptionEndsAt: oneYearFromNow.toISOString()
  });
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  const user = JSON.parse(localStorage.getItem('mizan_user') || '{}');
  const subscription = user.subscription;
  
  if (!subscription || subscription.tier !== 'premium') {
    return false;
  }
  
  if (!subscription.subscriptionEndsAt) {
    return true; // Lifetime/legacy premium
  }
  
  const expirationDate = new Date(subscription.subscriptionEndsAt);
  const now = new Date();
  
  if (expirationDate < now) {
    // Expired - downgrade to free
    await updateSubscription({
      tier: 'free',
      subscriptionEndsAt: null
    });
    return false;
  }
  
  return true;
}
