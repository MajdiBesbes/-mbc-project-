import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour récupérer les avis Google
Deno.serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Récupérer la clé API Google Places depuis les variables d'environnement
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Clé API Google Places manquante');
    }

    // ID du lieu Google (à remplacer par l'ID réel du cabinet)
    const placeId = 'ChIJxxxxxxxxx'; // Exemple d'ID

    // Faire la requête à l'API Google Places
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Erreur API Google Places: ${data.status}`);
    }

    // Formater les résultats
    const result = {
      name: data.result.name,
      rating: data.result.rating,
      reviews: data.result.reviews || []
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des avis Google:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});