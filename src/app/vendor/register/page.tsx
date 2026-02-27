'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Wheelchair', 'Apparel', 'Equipment', 'Wearables', 'Accessories'];

export default function VendorRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        businessName: '',
        email: '',
        phone: '',
        website: '',
        description: '',
        category: '',
        password: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app: POST to /api/vendor/register
        setTimeout(() => router.push('/vendor/dashboard'), 2500);
    };

    if (submitted) {
        return (
            <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
                <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2>Application Submitted!</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>Your vendor application for <strong>{form.businessName}</strong> is under review. Redirecting you to your vendor dashboard…</p>
                    <div style={{ marginTop: '1.5rem', width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--primary-color)', borderRadius: '999px', animation: 'progressBar 2.5s linear forwards' }} />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏪</div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Become a GIMA Vendor</h1>
                <p style={{ color: 'var(--text-muted)' }}>List your adaptive sports products on GIMA and reach thousands of athletes and coaches directly.</p>
            </div>

            {/* Progress Steps */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
                {['Business Info', 'Store Details', 'Account Setup'].map((label, i) => {
                    const num = i + 1;
                    const done = step > num;
                    const active = step === num;
                    return (
                        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', zIndex: 1,
                                background: done ? 'var(--success-color)' : active ? 'var(--primary-color)' : 'var(--surface-color-light)',
                                color: done || active ? 'white' : 'var(--text-muted)',
                                border: `2px solid ${done ? 'var(--success-color)' : active ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            }}>
                                {done ? '✓' : num}
                            </div>
                            <div style={{ fontSize: '0.7rem', marginTop: '6px', color: active ? 'var(--text-color)' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{label}</div>
                            {i < 2 && <div style={{ position: 'absolute', top: '18px', left: '60%', right: '-40%', height: '2px', background: done ? 'var(--success-color)' : 'var(--border-color)', zIndex: 0 }} />}
                        </div>
                    );
                })}
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
                <form onSubmit={step < 3 ? (e) => { e.preventDefault(); setStep(s => s + 1); } : handleSubmit}>
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h3 style={{ margin: 0 }}>Business Information</h3>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Name *</label>
                                <input required value={form.businessName} onChange={e => update('businessName', e.target.value)}
                                    placeholder="e.g. RollPro Sports Inc." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Email *</label>
                                <input required type="email" value={form.email} onChange={e => update('email', e.target.value)}
                                    placeholder="contact@yourbusiness.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                                <input value={form.phone} onChange={e => update('phone', e.target.value)}
                                    placeholder="+1 555 000 0000" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Website (optional)</label>
                                <input value={form.website} onChange={e => update('website', e.target.value)}
                                    placeholder="https://yourstore.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h3 style={{ margin: 0 }}>Store Details</h3>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Store Description *</label>
                                <textarea required value={form.description} onChange={e => update('description', e.target.value)}
                                    placeholder="Tell athletes and coaches about your products and brand..." rows={4}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Primary Product Category *</label>
                                <select required value={form.category} onChange={e => update('category', e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                                    <option value="">Select a category…</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ background: 'rgba(255,69,0,0.07)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                💡 After sign-up, you can add as many products as you like from your vendor dashboard, across all categories.
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h3 style={{ margin: 0 }}>Create Your Account</h3>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Vendor Password *</label>
                                <input required type="password" value={form.password} onChange={e => update('password', e.target.value)}
                                    placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.25rem', borderRadius: '10px' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Review Your Application</h4>
                                {[['Business', form.businessName], ['Email', form.email], ['Category', form.category]].map(([l, v]) => (
                                    <div key={l} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                                        <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>{l}:</span>
                                        <span style={{ fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input type="checkbox" required style={{ marginTop: '3px' }} />
                                I agree to the GIMA Vendor Terms of Service and understand my products will be reviewed before going live.
                            </label>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        {step > 1 ? (
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
                        ) : <div />}
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                            {step < 3 ? 'Continue →' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
