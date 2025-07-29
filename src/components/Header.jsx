import { Link } from 'react-router-dom';
import api from '../api';

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#FF7F50',
        textDecoration: 'none',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    welcome: {
        fontSize: '0.9rem',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#6c757d',
        color: 'white',
        cursor: 'pointer',
    }
};

function Header({ user, onLogout }) {

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            if (onLogout) onLogout();
            window.location.href = '/';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header style={styles.header}>
            <Link to='/places' style={styles.logo}>JeJu Trip</Link>
            {user && (
                <nav style={styles.nav}>
                    <span style={styles.welcome}>{user}님</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
                </nav>
            )}
        </header>
    );
}

export default Header;