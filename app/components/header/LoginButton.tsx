'use client';

type LoginButtonProps = {
  isActive: boolean;
};

export default function LoginButton({ isActive }: LoginButtonProps) {
  const handleClick = () => {
    alert('Login/Logout action coming soon!');
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      onClick={handleClick}>
      {isActive ? 'Logout' : 'Login'}
    </button>
  );
}
