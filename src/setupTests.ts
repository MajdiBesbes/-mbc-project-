import '@testing-library/jest-dom';

// Mock pour les fichiers
jest.mock('./__mocks__/fileMock.js', () => 'test-file-stub');

// Configuration globale pour les tests
beforeAll(() => {
  // Configuration avant tous les tests
});

afterAll(() => {
  // Nettoyage après tous les tests
});

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 