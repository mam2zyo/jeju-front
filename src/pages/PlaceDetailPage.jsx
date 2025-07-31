import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Header from '../components/Header';
import ReviewCard from '../components/ReviewCard';

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
};

const ReviewForm = ({ placeId, onReviewSubmit }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === '') {
            setError('리뷰 내용을 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.post(`/api/places/${placeId}/reviews`, { rating, content });
            onReviewSubmit(response.data);
            setContent('');
            setRating(5);
        } catch (err) {
            setError('리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요');
            console.error('Review submission failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formStyles = {
        form: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '2rem' },
        ratingContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
        textarea: { padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', resize: 'vertical' },
        button: { padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#FF7F50', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
        error: { color: 'red', fontSize: '0.9rem' }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyles.form}>
            <div style={formStyles.ratingContainer}>
                <label htmlFor='rating'>평점:</label>
                <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={5}>★★★★★</option>
                    <option value={4}>★★★★☆</option>
                    <option value={3}>★★★☆☆</option>
                    <option value={2}>★★☆☆☆</option>
                    <option value={1}>★☆☆☆☆</option>
                </select>
            </div>
            <textarea
                placeholder='리뷰를 남겨주세요.'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={formStyles.textarea} />
            <button type='submit' disabled={isSubmitting} style={formStyles.button}>
                {isSubmitting ? '등록 중...' : '리뷰 등록'}
            </button>
            {error && <p style={formStyles.error}>{error}</p>}
        </form>
    );
};

function PlaceDetailPage() {
    const { id } = useParams();
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

    const handleReviewSubmitted = (newReview) => {
        setPlace(prevPlace => ({
            ...prevPlace,
            reviews: [newReview, ...prevPlace.reviews]
        }));
    };

    const handleReviewUpdated = (updatedReview) => {
        setPlace(prevPlace => ({
            ...prevPlace,
            reviews: prevPlace.reviews.map(review =>
                review.id === updatedReview.id ? updatedReview : review
            ),
        }));
    };

    const handleReviewDeleted = (deletedReviewId) => {
        setPlace(prevPlace => ({
            ...prevPlace,
            reviews: prevPlace.reviews.filter(review => 
                review.id !== deletedReviewId),
        }));
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
                    <ReviewForm placeId={id} onReviewSubmit={handleReviewSubmitted} />
                    {place.reviews.length > 0 ? (
                        <div>
                            {place.reviews.map(review => (
                                <ReviewCard
                                key={review.id}
                                review={review}
                                currentUserEmail={user}
                                placeId={id}
                                onUpdate={handleReviewUpdated}
                                onDelete={handleReviewDeleted}
                                />
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