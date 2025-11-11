'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import Link from 'next/link';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const { isAuthenticated, user } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );
  const router = useRouter();

  const handleLogOut = async () => {
    await logout();
    router.push('/sign-in');
    clearIsAuthenticated();
  };

  return (
    <>
      {isAuthenticated ? (
        <ul>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user.username}</p>
            <button className={css.logoutButton} onClick={handleLogOut}>
              Logout
            </button>
          </li>{' '}
        </ul>
      ) : (
        <ul>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
