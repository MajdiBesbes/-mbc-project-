import { jsPDF } from 'jspdf';
import { analytics } from './analytics';

export const pdfExport = {
  async generateSimulationPDF(data: any, type: string) {
    try {
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.text('MBC High Value Business Consulting', 20, 20);
      
      doc.setFontSize(16);
      doc.text(`Simulation ${type}`, 20, 30);
      
      doc.setFontSize(12);
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 40);

      // Données de simulation
      doc.setFontSize(14);
      Object.entries(data).forEach(([key, value], index) => {
        const y = 60 + (index * 10);
        doc.text(`${key} : ${value}`, 20, y);
      });

      // Pied de page
      doc.setFontSize(10);
      doc.text('Document généré automatiquement - MBC Consulting', 20, 280);
      
      // Tracking
      analytics.trackEvent('pdf_export', {
        type: 'simulation',
        simulationType: type
      });

      return doc.save(`simulation-${type}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }
};