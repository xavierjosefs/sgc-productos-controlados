import { useState } from 'react';
import ClientTopbar from '../components/ClientTopbar';

/**
 * Página de Soporte y Contacto
 * Muestra FAQs y formulario de contacto
 */
export default function Support() {
  const [message, setMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: '¿Cuánto tarda la respuesta del Formulario Tipo A después de enviarlo?',
      answer: 'El tiempo de evaluación promedio es de 30 días laborales, dependiendo de la carga de solicitudes y de que los documentos estén completos y correctos.',
    },
    {
      id: 2,
      question: '¿Cuál es el tiempo de vigencia del Formulario Tipo A?',
      answer: 'Es de 3 años con la posibilidad de renovarlo.',
    },
    {
      id: 3,
      question: '¿Cuánto tarda la respuesta del Formulario Tipo B después de enviarlo?',
      answer: 'El tiempo de evaluación promedio es de 45 días laborales, dependiendo de la carga de solicitudes y de que los documentos estén completos y correctos.',
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Mensaje enviado:', message);
    setMessage('');
    alert('Mensaje enviado correctamente. Pronto nos pondremos en contacto contigo.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Soporte y Contacto</h1>

        {/* Preguntas Frecuentes */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[#4A8BDF] mb-6">Preguntas Frecuentes:</h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5m0 0l-7.5-7.5" />
                  </svg>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6">¡Envíanos un mensaje!</p>

          <form onSubmit={handleSendMessage}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] resize-none"
              rows={5}
              required
            />

            <button
              type="submit"
              className="mt-4 w-full px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
