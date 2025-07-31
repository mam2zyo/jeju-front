import { useState } from 'react';
import api from '../api';

const StarRating = ({ rating, setRating, isEditing }) => {
    const styles = {
        starRating: { color: '#f8d22f', marginBottom: '0.5rem', cursor: isEditing ? 'pointer' : 'default', fontSize: '1.2rem' },
    };

    if (isEditing) {
        return (
            <div style={styles.starRating}>
                {[5, 4, 3, 2, 1].map(star => (
                    <span key={star} onClick={() => setRating(star)}>
                        {rating >= star ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    }

    return <div style={styles.starRating}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>;
};

const styles = {
    reviewCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1rem' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    reviewer: { fontWeight: 'bold', color: '#333' },
    reviewDate: { fontSize: '0.8rem', color: '#888' },
    reviewContent: { fontSize: '1rem', color: '#444', marginTop: '0.75rem', whiteSpace: 'pre-wrap' },
    buttonGroup: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
    button: { padding: '0.3rem 0.7rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' },
    textarea: { width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', resize: 'vertical' },
};

function ReviewCard({ review, currentUserEmail, placeId, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const [editedRating, setEdiedRating] = useState(review.rating);

    const isOwner = review.reviewer === currentUserEmail;

    const formatDateTime = (createdAt, updatedAt) => {
        const isUpdated = new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;
        const dateToShow = isUpdated ? updatedAt : createdAt;
        const date = new Date(dateToShow);
        const formattedDate =
            `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        return isUpdated ? `${formattedDate} (수정됨)` : formattedDate;
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/api/places/${placeId}/reviews/${review.id}`, {
                rating: editedRating,
                content: editedContent
            });

            onUpdate(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('리뷰 수정 실패:', error);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('리뷰를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/places/${placeId}/reviews/${review.id}`);
                onDelete(review.id);
            } catch (error) {
                console.error('리뷰 삭제 실패:', error);
                alert('리뷰 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
                <span style={styles.reviewer}>{review.reviewer}</span>
                <span style={styles.reviewDate}>
                    {formatDateTime(review.createdAt, review.updatedAt)}
                </span>
            </div>
            {isEditing ? (
                <>
                    <StarRating rating={editedRating} setRating={setEdiedRating} isEditing={true} />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={styles.textarea} />
                    <div style={styles.buttonGroup}>
                        <button onClick={handleUpdate} style={styles.button}>저장</button>
                        <button onClick={() => setIsEditing(false)} style={styles.button}>취소</button>
                    </div>
                </>
            ) : (
                <>
                    <StarRating rating={review.rating} />
                    <p style={styles.reviewContent}>{review.content}</p>
                    {isOwner && (
                        <div style={styles.buttonGroup}>
                            <button onClick={() => setIsEditing(true)} style={styles.button}>수정</button>
                            <button onClick={handleDelete} style={styles.button}>삭제</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ReviewCard;