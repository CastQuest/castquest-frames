import Link from 'next/link';

export default function Home() {
  // Example token addresses for testing
  const exampleTokens = [
    { address: '0x1111111111111111111111111111111111111111', ticker: 'PIC' },
    { address: '0x2222222222222222222222222222222222222222', ticker: 'VID' },
  ];
  
  return (
    <main style={{
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'monospace',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2a 100%)',
      color: '#ffffff',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#FF00FF' }}>
          🎯 CastQuest Frames
        </h1>
        <p style={{ fontSize: '18px', color: '#888', marginBottom: '40px' }}>
          Farcaster-native frames for market signals and token details
        </p>
        
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
            📊 Tiny Market Signal Frames
          </h2>
          <p style={{ marginBottom: '20px', color: '#aaa' }}>
            Compact frames showing ticker, price, and 24h change with color-coded status
          </p>
          
          {exampleTokens.map((token) => (
            <div key={token.address} style={{
              background: '#1a1a2a',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '15px',
              border: '2px solid #333',
            }}>
              <h3 style={{ marginBottom: '10px' }}>${token.ticker}</h3>
              <Link
                href={`/api/frames/tiny-signal?token=${token.address}`}
                target="_blank"
                style={{ color: '#00FF00', textDecoration: 'underline' }}
              >
                /api/frames/tiny-signal?token={token.address}
              </Link>
            </div>
          ))}
        </div>
        
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
            📈 Token Detail Frames
          </h2>
          <p style={{ marginBottom: '20px', color: '#aaa' }}>
            Full metrics with price, volume, holders, and trading actions
          </p>
          
          {exampleTokens.map((token) => (
            <div key={token.address} style={{
              background: '#1a1a2a',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '15px',
              border: '2px solid #333',
            }}>
              <h3 style={{ marginBottom: '10px' }}>${token.ticker} Details</h3>
              <Link
                href={`/api/frames/token-detail?token=${token.address}`}
                target="_blank"
                style={{ color: '#00FF00', textDecoration: 'underline' }}
              >
                /api/frames/token-detail?token={token.address}
              </Link>
            </div>
          ))}
        </div>
        
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
            💎 CAST Protocol Overview
          </h2>
          <p style={{ marginBottom: '20px', color: '#aaa' }}>
            Main protocol token stats, fees, and governance
          </p>
          
          <div style={{
            background: '#2a1a3a',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #FF00FF',
          }}>
            <h3 style={{ marginBottom: '10px', color: '#FF00FF' }}>$CAST Protocol</h3>
            <Link
              href="/api/frames/cast-overview"
              target="_blank"
              style={{ color: '#FF00FF', textDecoration: 'underline' }}
            >
              /api/frames/cast-overview
            </Link>
          </div>
        </div>
        
        <div style={{
          padding: '30px',
          background: '#1a1a1a',
          borderRadius: '12px',
          border: '2px solid #444',
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>📚 Frame URLs</h2>
          <ul style={{ listStyle: 'none', padding: 0, color: '#aaa' }}>
            <li style={{ marginBottom: '10px' }}>
              <code>/api/frames/tiny-signal?token=ADDRESS</code> - Compact market signal
            </li>
            <li style={{ marginBottom: '10px' }}>
              <code>/api/frames/token-detail?token=ADDRESS</code> - Full token metrics
            </li>
            <li style={{ marginBottom: '10px' }}>
              <code>/api/frames/cast-overview</code> - Protocol overview
            </li>
          </ul>
          
          <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Integration
          </h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            All frames fetch data from the Core Services API at{' '}
            <code style={{ color: '#00FF00' }}>http://localhost:4000/api/v1</code>
            <br />
            Set <code>NEXT_PUBLIC_CORE_API_URL</code> environment variable to override.
          </p>
          
          <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Testing
          </h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            Test frames locally with the Farcaster Frame Validator:
            <br />
            <a
              href="https://warpcast.com/~/developers/frames"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00FF00' }}
            >
              https://warpcast.com/~/developers/frames
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
