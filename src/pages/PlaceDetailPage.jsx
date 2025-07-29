import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';

const StartRating = ({ rating }) => {
    return (
        <div>
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
    );
};

const styles = {
    loading: { textAlign: 'center', padding: '2rem', fontSize: '1.2rem' },
    error: { textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: 'red' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    backLink: { display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' },
    placeHeader: { marginBottom: '2rem' },
    placeImage: { width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' },
    title: { fontSize: '2.5rem', margin: '0 0 0.5rem' },
    address: { fontSize: '1.1rem', color: '#555', margin: '0 0 1rem' },
    introduction: { fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' },
    reviewsSection: { marginTop: '3rem' },
    reviewsTitle: { fontSize: '1.8rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' },
    reviewCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1rem' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    reviewer: { fontWeight: 'bold' },
    reviewDate: { fontSize: '0.8rem', color: '#888' },
    reviewContent: { fontSize: '1rem' },
};

function PlaceDetailPage() {
    const { id } = useParams();
    console.log('URL 파라미터에서 가져온  id:', id);
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoginAndFetchData = async () => {
            try {
                const userResponse = await api.get('/api/users/me');
                setUser(userResponse.data);

                const placeResponse = await api.get(`/api/places/${id}`);
                setPlace(placeResponse.data);
            } catch (err) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkLoginAndFetchData();
    }, [id]);

    const formatDateTime = (createdAt, updatedAt) => {
        const isUpdated = new Date(updatedAt).getTime() - new Date(createdAt).getTime > 1000;

        const dataToShow = isUpdated ? updatedAt : createdAt;
        const date = new Date(dataToShow);
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}
        .${String(date.getDate()).padStart(2, '0')}`;

        return isUpdated ? `${formattedDate} (수정됨)` : formattedDate;
    };

    if (loading) return <div style={styles.loading}>로딩 중...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    if (!place) return <div style={styles.error}>장소 정보를 찾을 수 없습니다.</div>;

    return (
        <div>
            <Header user={user} />
            <main style={styles.container}>
                <Link to='/places' style={styles.backLink}>← 목록으로 돌아가기</Link>

                <header style={styles.placeHeader}>
                    {place.imgPath && <img src={place.imgPath} alt={place.title} style={styles.placeImage} />}
                    <h1 style={styles.title}>{place.title}</h1>
                    <p style={styles.address}>{place.address}</p>
                </header>

                <section>
                    <p style={styles.introduction}>{place.introduction}</p>
                </section>

                <section style={styles.reviewsSection}>
                    <h2 style={styles.reviewsTitle}>리뷰 ({place.reviews.length})</h2>
                    {place.reviews.length > 0 ? (
                        <div>
                            {place.reviews.map(review => (
                                <div key={review.id} style={styles.reviewCard}>
                                    <div style={styles.reviewHeader}>
                                        <span style={styles.reviewer}>{review.reviewer}</span>
                                        <span style={styles.reviewDate}>{formatDateTime(review.createdAt, review.updatedAt)}</span>
                                    </div>
                                    <StartRating rating={review.rating} />
                                    <p style={styles.reviewContent}>{review.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>작성된 리뷰가 없습니다.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default PlaceDetailPage;