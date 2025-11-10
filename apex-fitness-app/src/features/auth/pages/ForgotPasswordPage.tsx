import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <ForgotPasswordForm
        onBackToLogin={() => {
          navigate('/login');
        }}
      />
    </div>
  );
}
