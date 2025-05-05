import React from 'react';
import TestimonialCard from './TestimonialCard';
import { useTracking } from '../hooks/useTracking';

const TestimonialSection: React.FC = () => {
  const { trackTestimonialInteraction } = useTracking();

  const testimonials = [
    {
      content: "MBC m'a accompagné dans la création de mon entreprise en France. Leur expertise des enjeux franco-maghrébins a été précieuse.",
      author: "Karim Benzarti",
      position: "Fondateur, KB Digital",
      rating: 5,
      date: "15 mars 2025",
      isGoogleReview: true
    },
    {
      content: "Un cabinet qui comprend vraiment les spécificités de notre activité entre la France et la Tunisie. Excellent suivi fiscal.",
      author: "Leila Mansouri",
      position: "Directrice, LM Import-Export",
      rating: 5,
      date: "10 mars 2025",
      isGoogleReview: true
    },
    {
      content: "Service professionnel et personnalisé. L'équipe parle arabe et comprend nos besoins spécifiques.",
      author: "Ahmed Bouazizi",
      position: "Gérant, Saveurs du Maghreb",
      rating: 5,
      date: "5 mars 2025",
      isGoogleReview: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Ils nous font confiance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              onClick={() => trackTestimonialInteraction(testimonial.author, 'click')}
              onMouseEnter={() => trackTestimonialInteraction(testimonial.author, 'view')}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;