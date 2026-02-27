'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockProducts, mockVendors } from '@/lib/shopData';

const mockVendorUser = mockVendors[0]; // Simulate logged-in vendor = RollPro Sports

export default function VendorDashboard() {
    const vendorProducts = mockProducts.filter(p => p.vendorId === mockVendorUser.id);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'Equipment' });
    const [products, setProducts] = useState(vendorProducts);
    const [added, setAdded] = useState(false);

    const totalRevenue = products.reduce((sum, p) => sum + p.price * Math.floor(Math.random() * 20 + 5), 0);
    const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setAdded(true);
        setShowAddModal(false);
        setTimeout(() => setAdded(false), 2500);
    };

    return (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', paddingBottom: '6rem' }}>
            {/* Vendor Header */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #c0392b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                            {mockVendorUser.logo}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{mockVendorUser.name}</h1>
                                {mockVendorUser.verified && (
                                    <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid #22c55e' }}>✓ Verified</span>
                                )}
                            </div>
                            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '0.9rem' }}>Vendor Dashboard · Member since {mockVendorUser.joinedDate}</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => setShowAddModal(true)}>
                        + Add Product
                    </button>
                </div>
            </div>

            {added && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
                    ✓ Your new product has been submitted for review and will be live within 24 hours.
                </div>
            )}

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Products', value: products.length, icon: '📦' },
                    { label: 'In Stock', value: products.filter(p => p.inStock).length, icon: '✅' },
                    { label: 'Avg. Rating', value: avgRating + ' ★', icon: '⭐' },
                    { label: 'Total Reviews', value: products.reduce((s, p) => s + p.reviewCount, 0), icon: '💬' },
                ].map(kpi => (
                    <div key={kpi.label} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{kpi.icon}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>My Products ({products.length})</h2>

            {/* Product Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-color-light)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Product</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Price</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Rating</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Stock</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <tr key={product.id} style={{ borderTop: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: 'var(--surface-color-light)', position: 'relative' }}>
                                                <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                                                {product.featured && <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 700 }}>⭐ Featured</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{product.category}</td>
                                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary-color)' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#f59e0b' }}>★</span> {product.rating} ({product.reviewCount})
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: product.inStock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: product.inStock ? '#22c55e' : '#ef4444' }}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
                                            <button style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Add New Product</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
                        </div>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Product Name *</label>
                                <input required value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. RollPro Speed Gloves V2" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Price (USD) *</label>
                                <input required type="number" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                                    placeholder="0.00" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category *</label>
                                <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                                    {['Wheelchair', 'Apparel', 'Equipment', 'Wearables', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description *</label>
                                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Describe your product's key features..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Product Image</label>
                                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer' }}>
                                    📷 Click to upload photo (JPG, PNG, max 5MB)
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit for Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
