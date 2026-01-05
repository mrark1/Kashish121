import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { POS } from './pages/POS';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { PublicPriceList } from './pages/PublicPriceList';
import { RecycleBin } from './pages/RecycleBin';
import { AppRoute } from './types';
import { StoreProvider, useAuth } from './store';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LOGIN);

  // Guard routing
  useEffect(() => {
    if (isAuthenticated && (currentRoute === AppRoute.LOGIN || currentRoute === AppRoute.FORGOT_PASSWORD)) {
      setCurrentRoute(AppRoute.DASHBOARD);
    } else if (!isAuthenticated && currentRoute !== AppRoute.FORGOT_PASSWORD && currentRoute !== AppRoute.PUBLIC_PRICES) {
      setCurrentRoute(AppRoute.LOGIN);
    }
  }, [isAuthenticated, currentRoute]);

  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.LOGIN:
        return <Login onNavigate={setCurrentRoute} />;
      case AppRoute.FORGOT_PASSWORD:
        return <ForgotPassword onNavigate={setCurrentRoute} />;
      case AppRoute.PUBLIC_PRICES:
        return <PublicPriceList onNavigate={setCurrentRoute} />;
      case AppRoute.DASHBOARD:
        return <Dashboard />;
      case AppRoute.INVENTORY:
        return <Inventory />;
      case AppRoute.POS:
        return <POS />;
      case AppRoute.REPORTS:
        return <Reports products={[]} sales={[]} />; // Reports page needs refactor to use store inside it, but passing empty arrays for now as props are legacy
      case AppRoute.RECYCLE_BIN:
        return <RecycleBin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
