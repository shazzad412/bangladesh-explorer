import { useMemo, useState } from 'react';
import { districts } from './data/districts';

function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('sylhet');

  const filteredDistricts = useMemo(() => {
    return districts.filter((district) => {
      const searchTerm = query.toLowerCase();
      return (
        district.name.toLowerCase().includes(searchTerm) ||
        district.division.toLowerCase().includes(searchTerm) ||
        district.highlights.some((item) => item.toLowerCase().includes(searchTerm))
      );
    });
  }, [query]);

  const selectedDistrict =
    filteredDistricts.find((district) => district.id === selectedId) ||
    districts.find((district) => district.id === selectedId) ||
    districts[0];

  const shareUrl = `https://bangladesh-explorer.vercel.app/district/${selectedDistrict.id}`;
  const shareText = `Visit ${selectedDistrict.name} in Bangladesh! ${selectedDistrict.description}`;

  const handleCopyLink = async () => {
    const shareMessage = `${shareText}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert('Share link copied to clipboard!');
    } catch (error) {
      alert('Copy failed. You can still copy the URL manually.');
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = () => {
    const caption = `${shareText}\n${shareUrl}`;
    navigator.clipboard.writeText(caption).then(() => {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      alert('Caption copied. Paste it when you create an Instagram post.');
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Travel discovery</p>
          <h1>Bangladesh Explorer</h1>
        </div>
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search district or place"
            aria-label="Search district"
          />
        </div>
      </header>

      <main className="content">
        <section className="district-list">
          <div className="section-header">
            <h2>Popular districts</h2>
          </div>

          <div className="card-grid">
            {filteredDistricts.map((district) => (
              <button
                key={district.id}
                className={`district-card ${selectedDistrict.id === district.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(district.id)}
                type="button"
              >
                <img src={district.image} alt={district.name} />
                <div className="card-body">
                  <span className="tag">{district.division}</span>
                  <h3>{district.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="details-panel">
          <img src={selectedDistrict.image} alt={selectedDistrict.name} className="detail-image" />

          <div className="detail-body">
            <span className="tag">{selectedDistrict.division}</span>
            <h2>{selectedDistrict.name}</h2>
            <p>{selectedDistrict.description}</p>

            <div className="meta-row">
              <div>
                <strong>Best time to visit</strong>
                <span>{selectedDistrict.bestTime}</span>
              </div>
            </div>

            <div className="highlights-block">
              <h3>Top highlights</h3>
              <ul>
                {selectedDistrict.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="share-actions">
              <button className="primary-btn" onClick={handleFacebookShare} type="button">
                📖 Share on Facebook
              </button>
              <button className="secondary-btn" onClick={handleInstagramShare} type="button">
                📷 Share on Instagram
              </button>
              <button className="ghost-btn" onClick={handleCopyLink} type="button">
                🔗 Copy share link
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
