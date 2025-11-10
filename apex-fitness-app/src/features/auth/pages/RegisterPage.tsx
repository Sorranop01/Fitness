import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <RegisterForm
        onSuccess={() => {
          navigate('/');
        }}
        onLoginClick={() => {
          navigate('/login');
        }}
      />
    </div>
  );
}
