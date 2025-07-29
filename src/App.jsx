import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PlaceListPage from './pages/PlaceListPage';
import OAuthRedirectionPage from './pages/OAuthRedirectionPage.jsx';
import PlaceDetailPage from './pages/PlaceDetailPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/places' element={<PlaceListPage />} />
        <Route path='/oauth/redirect' element={<OAuthRedirectionPage />} />
        <Route path='/places/:id' element={<PlaceDetailPage />} />
      </Routes>
    </Router>    
  );
}

export default App