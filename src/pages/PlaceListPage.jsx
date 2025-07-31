import { useState, useEffect, useCallback } from 'react';
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
    loadMoreButton: { 
        display: 'block',
        width: '100%',
        padding: '1rem',
        marginTop: '1rem',
        backgroundColor: '#f0f0f0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem'
      }
};

function PlaceListPage() {
    const [places, setPlaces] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // 로그인 상태 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get('/api/users/me');
                setUser(response.data);
            } catch (err) {
                window.location.href = '/';
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        fetchPlaces(searchTerm, 0);
    }, []);


    // 데이터를 불러오는 함수
    const fetchPlaces = useCallback(async(searchTerm, pageToFetch) => {

        setLoading(true);
        setError(null);

        try {
            const url = searchTerm
                ? `/api/places/search?title=${searchTerm}&page=${pageToFetch}&size=10`
                : `/api/places?page=${pageToFetch}&size=10`;

            const response = await api.get(url);
            const data = response.data;

            if (pageToFetch === 0) {
                setPlaces(data.content);
            } else {
                setPlaces(prevPlaces => [...prevPlaces, ...data.content]);
            }
            setHasMore(!data.last);
            setPage(pageToFetch);
        } catch (err) {
            setError('장소 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchPlaces(searchTerm, 0);
        }
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPlaces(searchTerm, 0);
    };

    const loadMore = () => {
        fetchPlaces(searchTerm, page + 1);
    }

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

                {places.length === 0 && loading && <div style={styles.loading}>로딩 중...</div>}
                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.placeList}>
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

                {hasMore && (
                    <button onClick={loadMore} disabled={loading} style={styles.loadMoreButton}>
                        {loading ? '로딩 중...' : '더보기'}
                    </button>
                )}
            </main>
        </div>
    );
}

export default PlaceListPage;