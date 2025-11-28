import { useState } from 'react';
import { ClientTopbar, Accordion, Textarea, Button, Card } from '../components';

/**
 * Página de Soporte y Contacto
 * Muestra FAQs y formulario de contacto
 */
export default function Support() {
  const [message, setMessage] = useState('');

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
          <Accordion items={faqs} />
        </div>

        {/* Formulario de contacto */}
        <Card className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6">¡Envíanos un mensaje!</p>

          <form onSubmit={handleSendMessage}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              className="mt-4 w-full"
            >
              Enviar Mensaje
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
