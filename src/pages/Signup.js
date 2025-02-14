import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/context';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, errorEmail, errorPassword } = useAuth();
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas');
        return;
      }
      
      setPasswordError('');
      const user = await signup({ email, password });
      
      if (user) {
        navigate('/home');
      }
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex h-full flex-col bg-slate-900">
      <div className="flex-1 h-full w-full bg-slate-900 flex items-center justify-center px-6 py-8">
        <div className='flex flex-col w-full max-w-sm'>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:text-slate-300 transition-colors"
            >
              ←
            </button>
            <h2 className="text-left text-2xl font-bold text-white ml-4">
              Créer un compte
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <FormField
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
                error={errorEmail}
              />
              <FormField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={errorPassword || passwordError}
              />
              <FormField
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <Button onClick={handleSubmit} variant="primary">
                Créer mon compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
