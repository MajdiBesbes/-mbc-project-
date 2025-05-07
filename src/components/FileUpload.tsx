import React, { useCallback, useState } from 'react';
import { FaUpload, FaTimes, FaFile } from 'react-icons/fa';
import { validateFile } from '../utils/formValidation';

interface FileUploadProps {
  name: string;
  onChange: (files: File[]) => void;
  onError?: (errors: string[]) => void;
  multiple?: boolean;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  label?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  onChange,
  onError,
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  className = '',
  label = 'Glisser-déposer des fichiers ou cliquer pour sélectionner',
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFiles = useCallback((files: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    if (maxFiles && files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} fichier(s) autorisé(s)`);
      return { errors, validFiles };
    }

    files.forEach(file => {
      const validation = validateFile(file, { maxSize, allowedTypes: accept });
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(...validation.errors);
      }
    });

    return { errors, validFiles };
  }, [maxSize, accept, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const { errors, validFiles } = validateFiles(files);

    if (errors.length > 0) {
      onError?.(errors);
    } else {
      setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
      onChange(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    }
  }, [multiple, selectedFiles, onChange, onError, validateFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { errors, validFiles } = validateFiles(files);

    if (errors.length > 0) {
      onError?.(errors);
    } else {
      setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
      onChange(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    }
  }, [multiple, selectedFiles, onChange, onError, validateFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onChange(newFiles);
  }, [selectedFiles, onChange]);

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          multiple={multiple}
          accept={accept?.join(',')}
          onChange={handleFileSelect}
          className="file-upload-input"
        />
        <FaUpload className="file-upload-icon" />
        <p className="file-upload-label">{label}</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-upload-list">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-upload-item">
              <FaFile className="file-upload-item-icon" />
              <span className="file-upload-item-name">{file.name}</span>
              <button
                type="button"
                className="file-upload-item-remove"
                onClick={() => removeFile(index)}
                aria-label="Supprimer le fichier"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
}; 