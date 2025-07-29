import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    searchBar: { display: 'flex', marginBottom: '2rem', gap: '0.5rem' },
    searchInput: { flex: 1, padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px' },
    searchButton: { padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', cursor: 'pointer' },
    placeList: { display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' },
    placeCard: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
    },
    thumbnail: { width: '120px', height: '120px', objectFit: 'cover' },
    cardContent: { padding: '1rem' },
    cardTitle: { margin: '0 0 0.5rem', fontSize: '1.2rem' },
    cardAddress: { margin: '0', fontSize: '0.9rem', color: '#666' },
    loading: { textAlign: 'center', padding: '2rem', fontSize: '1.2rem' },
    error: { textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: 'red' },

};

function PlaceListPage() {
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get('api/users/me');
                setUser(response.data);
            } catch (err) {
                window.location.href = '/';
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async (title = '') => {
        setLoading(true);
        setError(null);
        try {
            const url = title ? '/api/places/search?title=${title}' : '/api/places';
            const response = await api.get(url);
            setPlaces(response.data);
        } catch (err) {
            setError('장소 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlaces(serchTerm);
    };

    if (!user) {
        return <div style={styles.loading}>인증 확인 중...</div>;
    }

    return (
        <div>
            <Header user={user} />
            <main style={styles.container}>
                <form onSubmit={handleSearch} style={styles.searchBar}>
                    <input
                        type='text'
                        placeholder="장소 이름으로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button type="submit" style={styles.searchButton}>검색</button>
                </form>

                {loading && <div style={styles.loading}>로딩 중...</div>}
                {error && <div style={styles.error}>{error}</div>}

                {!loading && !error && (
                    <div styles={styles.placeList}>
                        {places.map(place => (
                            <Link to={`/places/${place.id}`} key={place.id} style={styles.placeCard}>
                                <img src={place.thumbnailPath} alt={place.title} style={styles.thumbnail} />
                                <div style={styles.cardContent}>
                                    <h3 style={styles.cardTitle}>{place.title}</h3>
                                    <p style={styles.cardAddress}>{place.address}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default PlaceListPage;