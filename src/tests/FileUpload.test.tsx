import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../components/FileUpload';

describe('FileUpload', () => {
  const mockOnChange = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant correctement', () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        label="Test Label"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('devrait gérer le glisser-déposer de fichiers', async () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        accept={['image/jpeg']}
        maxSize={1024 * 1024}
      />
    );

    const dropzone = screen.getByRole('button');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('dragging');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
  });

  it('devrait gérer la sélection de fichiers via le bouton', async () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        accept={['image/jpeg']}
        maxSize={1024 * 1024}
      />
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button').querySelector('input');

    await userEvent.upload(input!, file);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([file]);
    });
  });

  it('devrait afficher une erreur pour un fichier trop volumineux', async () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        onError={mockOnError}
        maxSize={1024 * 1024}
      />
    );

    const file = new File(['test'.repeat(1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button').querySelector('input');

    await userEvent.upload(input!, file);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  it('devrait supprimer un fichier', async () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        multiple
      />
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button').querySelector('input');

    await userEvent.upload(input!, file);

    const removeButton = screen.getByLabelText('Supprimer le fichier');
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  it('devrait gérer plusieurs fichiers', async () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        multiple
      />
    );

    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
    ];

    const input = screen.getByRole('button').querySelector('input');
    await userEvent.upload(input!, files);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(files);
    });
  });

  it('devrait afficher une erreur personnalisée', () => {
    render(
      <FileUpload
        name="test"
        onChange={mockOnChange}
        error="Erreur personnalisée"
      />
    );

    expect(screen.getByText('Erreur personnalisée')).toBeInTheDocument();
  });
}); 