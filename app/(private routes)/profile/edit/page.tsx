'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe, getMe } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    getMe().then(user => {
      setUserName(user.username ?? '');
      setUserEmail(user.email ?? '');
    });
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await updateMe({ username: userName });
    console.log(res);
    if (res) {
      setUser(res);
      console.log('STATE:', useAuthStore.getState());
      router.push('/profile');
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar ?? '/avatar-default.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleUpdateUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={userName}
              onChange={handleChange}
            />
          </div>

          <p>Email: {userEmail}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
