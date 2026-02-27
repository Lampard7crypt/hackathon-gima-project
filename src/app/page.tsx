import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>For the Unstoppable.</h1>
          <p>The premium platform for wheelchair sports athletes to showcase their stats, history, and connect with elite coaches.</p>

          <div className="role-cards mt-4">
            <div className="card text-center">
              <h3>I am an Athlete</h3>
              <p>Showcase your stats, get AI-driven training recommendations, and find a coach.</p>
              <Link href="/register?role=player" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Join as Player
              </Link>
            </div>

            <div className="card text-center">
              <h3>I am a Coach</h3>
              <p>Discover top talent, verify stats, and connect directly with athletes.</p>
              <Link href="/register?role=coach" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                Join as Coach
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
