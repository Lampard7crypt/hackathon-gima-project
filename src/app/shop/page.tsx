'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts, mockVendors, Product } from '@/lib/shopData';

const CATEGORIES = ['All', 'Wheelchair', 'Apparel', 'Equipment', 'Wearables', 'Accessories'] as const;

function StarRating({ rating }: { rating: number }) {
    return (
        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
        </span>
    );
}

function ProductCard({ product }: { product: Product }) {
    const vendor = mockVendors.find(v => v.id === product.vendorId);
    const [added, setAdded] = useState(false);

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {product.featured && (
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--primary-color)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', zIndex: 1 }}>
                    ⭐ Featured
                </div>
            )}
            {!product.inStock && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#ccc', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', zIndex: 1 }}>
                    Out of Stock
                </div>
            )}

            {/* Product Image */}
            <div style={{ position: 'relative', height: '220px', background: 'var(--surface-color-light)', overflow: 'hidden' }}>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain', padding: '1rem', transition: 'transform 0.3s ease' }}
                    className="product-img"
                />
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Vendor */}
                <div style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {vendor?.logo} {vendor?.name}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{product.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {product.description.slice(0, 100)}…
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.75rem' }}>
                    {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: '0.65rem', background: 'var(--bg-color)', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div style={{ marginBottom: '1rem' }}>
                    <StarRating rating={product.rating} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({product.reviewCount})</span>
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                        ${product.price.toFixed(2)}
                    </div>
                    <button
                        className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', opacity: !product.inStock ? 0.5 : 1 }}
                        disabled={!product.inStock}
                        onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                    >
                        {!product.inStock ? 'Out of Stock' : added ? '✓ Added!' : '+ Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    const [category, setCategory] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
    const [selectedVendor, setSelectedVendor] = useState<string>('');

    const filtered = useMemo(() => {
        let products = [...mockProducts];
        if (category !== 'All') products = products.filter(p => p.category === category);
        if (selectedVendor) products = products.filter(p => p.vendorId === selectedVendor);
        if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
        switch (sort) {
            case 'price-asc': return products.sort((a, b) => a.price - b.price);
            case 'price-desc': return products.sort((a, b) => b.price - a.price);
            case 'rating': return products.sort((a, b) => b.rating - a.rating);
            default: return products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }, [category, search, sort, selectedVendor]);

    return (
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', paddingBottom: '6rem' }}>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, #c0392b 100%)',
                borderRadius: '20px', padding: '3rem', marginBottom: '3rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
            }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: '2.5rem', margin: 0, fontWeight: 900 }}>GIMA Shop</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Adaptive sports gear from trusted vendors, all in one place.</p>
                </div>
                <Link href="/vendor/register" className="btn" style={{ background: 'white', color: 'var(--primary-color)', fontWeight: 700, padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                    🏪 Become a Vendor
                </Link>
            </div>

            {/* Vendor Strip */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Our Verified Vendors</h2>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setSelectedVendor('')}
                        style={{ flexShrink: 0, padding: '0.75rem 1.25rem', borderRadius: '12px', border: `2px solid ${selectedVendor === '' ? 'var(--primary-color)' : 'var(--border-color)'}`, background: selectedVendor === '' ? 'rgba(255,69,0,0.1)' : 'var(--surface-color)', cursor: 'pointer', color: 'var(--text-color)', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                        All Vendors
                    </button>
                    {mockVendors.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVendor(selectedVendor === v.id ? '' : v.id)}
                            style={{ flexShrink: 0, padding: '0.75rem 1.25rem', borderRadius: '12px', border: `2px solid ${selectedVendor === v.id ? 'var(--primary-color)' : 'var(--border-color)'}`, background: selectedVendor === v.id ? 'rgba(255,69,0,0.1)' : 'var(--surface-color)', cursor: 'pointer', color: 'var(--text-color)', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <span>{v.logo}</span>
                            <span>{v.name}</span>
                            {v.verified && <span style={{ color: '#22c55e', fontSize: '0.7rem' }}>✓</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Sidebar Filters */}
                <aside className="card" style={{ position: 'sticky', top: '90px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Filters</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Category</div>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
                                    background: category === cat ? 'rgba(255,69,0,0.12)' : 'transparent',
                                    color: category === cat ? 'var(--primary-color)' : 'var(--text-color)',
                                    fontWeight: category === cat ? 700 : 400,
                                    cursor: 'pointer', fontSize: '0.875rem', marginBottom: '2px'
                                }}
                            >{cat}</button>
                        ))}
                    </div>

                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Sort By</div>
                        {[
                            { value: 'featured', label: '⭐ Featured First' },
                            { value: 'price-asc', label: '💲 Price: Low to High' },
                            { value: 'price-desc', label: '💰 Price: High to Low' },
                            { value: 'rating', label: '🏆 Highest Rated' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSort(opt.value as typeof sort)}
                                style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
                                    background: sort === opt.value ? 'rgba(255,69,0,0.12)' : 'transparent',
                                    color: sort === opt.value ? 'var(--primary-color)' : 'var(--text-color)',
                                    fontWeight: sort === opt.value ? 700 : 400,
                                    cursor: 'pointer', fontSize: '0.875rem', marginBottom: '2px'
                                }}
                            >{opt.label}</button>
                        ))}
                    </div>
                </aside>

                {/* Product Grid */}
                <div>
                    {/* Search + count */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Search products or tags..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1, minWidth: '200px', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-color)', fontSize: '0.9rem' }}
                        />
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {filtered.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <p>No products match your filters. Try a different category or search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
