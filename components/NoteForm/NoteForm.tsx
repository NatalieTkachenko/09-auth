'use client';

import { useId } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote } from '@/lib/api';
import type { NewNote } from '@/lib/api';

import { useNoteDraftStore } from '@/lib/store/noteStore';

import css from './NoteForm.module.css';

// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
// }

// const NoteFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, 'Please, make up longer title')
//     .max(50, 'Too long title')
//     .required('It is required field'),
//   content: Yup.string().max(500, 'Too much of text'),
//   tag: Yup.string()
//     .matches(/^(Todo|Work|Personal|Meeting|Shopping)$/)
//     .required('It is required'),
// });

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: data => {
      console.log('you created a new note ', data);
      toast.success(`you created a new note ${data.title}`, {
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ['noteList'] });
      clearDraft();
      router.push('/notes/filter/All');
    },
    onError: error => {
      console.log('Your new note was not created because of the error ', error);
      toast.error('Your new note was not created because of the error ', {
        duration: 4000,
      });
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as NewNote;

    mutate(values);
  };
  const handleCancel = () => {
    router.push('/notes/filter/All');
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          defaultValue={draft?.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}
