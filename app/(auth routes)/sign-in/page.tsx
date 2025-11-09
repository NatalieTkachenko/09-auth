'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { login, LogInRequest } from '@/lib/api/clientApi';
import css from './SignInPage.module.css';
export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuthStore();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: LogInRequest = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    const response = await login(data);

    if (response) {
      console.log('You have successfully logged in');
      setUser(response);

      router.push('/profile');
    }
  };
  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {/* <p className={css.error}>{error}</p> */}
      </form>
    </main>
  );
}
