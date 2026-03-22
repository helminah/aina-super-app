import { ArrowLeft, Instagram, BookOpen, GraduationCap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DoctorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-ivory-100 safe-top safe-bottom">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-bark-800" />
        </button>
        <h1 className="font-heading text-xl font-bold text-bark-800">Dr Helminah</h1>
      </div>

      <div className="px-5 pb-8">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-forest-100 flex items-center justify-center text-4xl mb-3">
            👩‍⚕️
          </div>
          <h2 className="font-heading text-2xl font-bold text-bark-800 text-center">Dr Helminah Randriamananoro</h2>
          <p className="text-bark-500 text-sm mt-1">Pédiatre - DES Pédiatrie, Dakar</p>
        </div>

        {/* About AINA */}
        <div className="bg-forest-600 rounded-3xl p-6 mb-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5" />
            <h3 className="font-heading font-bold">À propos d'AINA</h3>
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            AINA signifie "La Vie, Le Souffle" en malgache. Cette application est née de la passion du Dr Helminah pour la pédiatrie et de sa volonté de rendre le suivi de bébé accessible à toutes les mamans, en Afrique et partout dans le monde.
          </p>
        </div>

        {/* Education */}
        <div className="bg-ivory-50 rounded-3xl p-5 mb-5 ambient-shadow">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-forest-600" />
            <h3 className="font-heading font-bold text-bark-800">Parcours</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-forest-600" />
                <div className="w-0.5 flex-1 bg-forest-200 mt-1" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-bark-800">2014 - 2022</p>
                <p className="text-sm text-bark-500">Études de Médecine</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-forest-600" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-bark-800">2024 - 2027</p>
                <p className="text-sm text-bark-500">DES Pédiatrie, Université Cheikh Anta Diop, Dakar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Book */}
        <div className="bg-ivory-50 rounded-3xl p-5 mb-5 ambient-shadow">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-terra-500" />
            <h3 className="font-heading font-bold text-bark-800">Guide publié</h3>
          </div>
          <p className="font-heading font-bold text-bark-800">Guide de nutrition infantile</p>
          <p className="text-sm text-bark-500 mt-1">170 pages, 70+ recettes adaptées aux produits locaux africains.</p>
        </div>

        {/* Social */}
        <div className="bg-ivory-50 rounded-3xl p-5 ambient-shadow">
          <h3 className="font-heading font-bold text-bark-800 mb-3">Suivez-moi</h3>
          <div className="space-y-3">
            {[['Instagram', '@drhelminah'], ['TikTok', '@drhelminah'], ['LinkedIn', 'Dr Helminah R.']].map(([platform, handle]) => (
              <div key={platform} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-bark-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-bark-800">{platform}</p>
                  <p className="text-xs text-bark-500">{handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
