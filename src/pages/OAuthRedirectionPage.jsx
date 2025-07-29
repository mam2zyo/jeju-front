import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
    },
};

function OAuthRedirectionPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginAndRedirect = async () => {
            try {
                await api.get('/api/users/me');
                navigate('/places');
            } catch (error) {
                console.error("소셜 로그인 후 상태 확인 실패: ", error);
                navigate('/');
            }
        };
        checkLoginAndRedirect();
    }, [navigate]);

    return (
        <div style={styles.container}>
          로그인 처리 중입니다...
        </div>
    );
}

export default OAuthRedirectionPage;