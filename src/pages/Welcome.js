import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex h-full flex-col bg-slate-900">
      <div className="flex-1 h-full w-full bg-slate-900 flex items-center justify-center px-6 py-8">
        <div className='flex flex-col w-full max-w-sm items-center'>
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            EDTIA
          </h1>
          <p className="text-slate-300 text-center mb-12">
            Bienvenue sur EDTIA, consultez l'emplois du temps d'une salle grâce a votre caméra
          </p>
          
          <div className="w-full space-y-4">
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup')}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
