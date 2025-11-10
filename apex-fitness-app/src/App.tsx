import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/router/routes';
import { Toast } from '@/components/ui/Toast';

function App() {
  return (
    <BrowserRouter>
      <Toast />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
