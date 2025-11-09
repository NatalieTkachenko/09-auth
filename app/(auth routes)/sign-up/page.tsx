'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useState } from 'react';
import { register, RegisterRequest } from '@/lib/api/clientApi';

import css from './SignUpPage.module.css';

export default function SignUpPage() {
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: RegisterRequest = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };
    const responseFromServer = await register(data);
    console.log(responseFromServer);
    if (responseFromServer) {
      setUser(responseFromServer);
      router.push('/profile');
    }
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
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
            Register
          </button>
        </div>
        {error && <p className={css.error}>Error</p>}
      </form>
    </main>
  );
}
