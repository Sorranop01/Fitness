import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <LoginForm
        onSuccess={() => {
          navigate('/');
        }}
        onRegisterClick={() => {
          navigate('/register');
        }}
        onForgotPasswordClick={() => {
          navigate('/forgot-password');
        }}
      />
    </div>
  );
}
