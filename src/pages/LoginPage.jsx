import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const styles = {
    pageContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    box: { width: '90%', maxWidth: '400px', padding: '40px 30px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center' },
    headerTitle: { color: '#FF7F50', fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', letterSpacing: '1px' },
    boxTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
    welcomeMessage: { fontSize: '18px', fontWeight: '500', marginBottom: '30px', lineHeight: '1.5', wordBreak: 'break-all', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },
    primaryButton: { backgroundColor: '#007bff', color: 'white' },
    divider: { display: 'flex', alignItems: 'center', textAlign: 'center', color: '#888', margin: '24px 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#ddd' },
    dividerText: { margin: '0 10px' },
    googleButton: { backgroundColor: '#4285F4', color: 'white', marginBottom: '12px' },
    naverButton: { backgroundColor: '#03C75A', color: 'white' },
    errorMessage: { color: '#dc3545', marginTop: '16px', fontSize: '14px' }
};

function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                await api.get('/api/users/me');
                navigate('/places');
                setUser(Response.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, [navigate]);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/auth/login', { email, password });
            navigate('/places');
        } catch (err) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            console.error('Login failed:', err);
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `/oauth2/authorization/${provider}`;
    };

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (loading) {
        return <div style={styles.pageContainer}><div>로딩 중...</div></div>;
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.box}>
                <h1 style={styles.headerTitle}>JeJu Trip</h1>
                {user ? (
                    <div>
                        <p style={styles.welcomeMessage}>{`${user}님 환영합니다.`}</p>
                        <button
                            onClick={handleLogout}
                            style={{ ...styles.button, ...styles.primaryButton }}
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 style={styles.boxTitle}>로그인</h2>
                        <form onSubmit={handleEmailLogin} style={styles.form}>
                            <input
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>
                                로그인
                            </button>
                        </form>
                        {error && <p style={styles.errorMessage}>{error}</p>}
                        <div style={styles.divider}>
                            <div style={styles.dividerLine} />
                            <span style={styles.dividerText}>또는</span>
                            <div style={styles.dividerLine} />
                        </div>
                        <button
                            onClick={() => handleSocialLogin('google')}
                            style={{ ...styles.button, ...styles.googleButton }}
                        >
                            Google 계정으로 로그인
                        </button>
                        <button
                            onClick={() => handleSocialLogin('naver')}
                            style={{ ...styles.button, ...styles.naverButton }}
                        >
                            Naver 계정으로 로그인
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;