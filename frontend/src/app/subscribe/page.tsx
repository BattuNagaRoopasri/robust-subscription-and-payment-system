'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface SubscriptionData {
  plan: 'monthly' | 'yearly' | 'none';
  status: 'active' | 'canceled' | 'past_due' | 'none';
  expiresAt: string | null;
}

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        setSubData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to subscribe to a plan.');
      router.push('/login');
      return;
    }

    setProcessingPlan(plan);
    try {
      const res = await fetch('http://localhost:5000/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        alert(data.message);
        setSubData(data.data);
      } else {
        alert(data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing cycle.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        alert(data.message);
        setSubData(data.data);
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <>
        <main className={styles.container}>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading subscription details...</div>
        </main>
      </>
    );
  }

  const isActive = subData?.status === 'active';
  const isCanceled = subData?.status === 'canceled';

  return (
    <>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Subscription & Plans</h1>
          <p className={styles.subtitle}>Choose a plan to support charities and gain access to the monthly draws.</p>
        </div>

        {/* Current Status Card */}
        <div className={styles.statusCard}>
          <div className={styles.statusInfo}>
            <h3>Current Status</h3>
            <p>
              {subData?.plan === 'none' ? 'You are not currently subscribed.' : `You are on the ${subData?.plan} plan.`}
            </p>
            {subData?.expiresAt && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {isCanceled ? 'Access ends on: ' : 'Renews on: '}
                {new Date(subData.expiresAt).toLocaleDateString()}
              </p>
            )}
            
            <span className={`${styles.statusBadge} ${
              isActive ? styles.statusActive : 
              isCanceled ? styles.statusCanceled : styles.statusNone
            }`}>
              {subData?.status || 'None'}
            </span>
          </div>
          
          {isActive && (
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Cancel Subscription
            </button>
          )}
        </div>

        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {/* Monthly Plan */}
          <div className={styles.planCard}>
            <h2 className={styles.planName}>Monthly Plan</h2>
            <div className={styles.planPrice}>
              <span className={styles.planCurrency}>$</span>19
              <span className={styles.planPeriod}>/mo</span>
            </div>
            <p className={styles.planDesc}>Perfect for trying out the platform and making a short-term impact.</p>
            
            <ul className={styles.planFeatures}>
              <li>Full platform access</li>
              <li>Monthly charity contributions</li>
              <li>Entry into monthly draws</li>
              <li>Cancel anytime</li>
            </ul>

            <button 
              className={`${styles.subscribeBtn} ${subData?.plan === 'monthly' && isActive ? styles.subscribeBtnDisabled : ''}`}
              onClick={() => handleSubscribe('monthly')}
              disabled={processingPlan !== null || (subData?.plan === 'monthly' && isActive)}
            >
              {processingPlan === 'monthly' ? 'Processing...' : 
               (subData?.plan === 'monthly' && isActive) ? 'Current Plan' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className={`${styles.planCard} ${styles.planPopular}`}>
            <div className={styles.popularBadge}>SAVE 20%</div>
            <h2 className={styles.planName}>Yearly Plan</h2>
            <div className={styles.planPrice}>
              <span className={styles.planCurrency}>$</span>182
              <span className={styles.planPeriod}>/yr</span>
            </div>
            <p className={styles.planDesc}>Maximize your impact with our discounted annual subscription.</p>
            
            <ul className={styles.planFeatures}>
              <li>All Monthly features</li>
              <li>20% discount applied</li>
              <li>Greater charity impact</li>
              <li>Priority support</li>
            </ul>

            <button 
              className={`${styles.subscribeBtn} ${styles.subscribeBtnPrimary} ${subData?.plan === 'yearly' && isActive ? styles.subscribeBtnDisabled : ''}`}
              onClick={() => handleSubscribe('yearly')}
              disabled={processingPlan !== null || (subData?.plan === 'yearly' && isActive)}
            >
              {processingPlan === 'yearly' ? 'Processing...' : 
               (subData?.plan === 'yearly' && isActive) ? 'Current Plan' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
