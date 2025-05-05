import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { pdfExport } from '../services/pdfExport';

interface ExportPDFButtonProps {
  data: any;
  type: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ data, type }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await pdfExport.generateSimulationPDF(data, type);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <FileDown className="w-5 h-5 mr-2" />
      )}
      Exporter en PDF
    </button>
  );
};

export default ExportPDFButton;