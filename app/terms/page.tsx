import { LegalPage, LegalSection } from "@/components/legal-page"

export default function TermsPage() {
  return (
    <LegalPage title="Términos de Servicio" lastUpdated="22 de junio de 2026">
      <p className="text-gray-300 text-sm leading-relaxed">
        Estos Términos de Servicio (&ldquo;Términos&rdquo;) rigen el uso de PRIME GROWTH OS, un producto desarrollado
        por Juan Carlos Caro Sierra en Medellín, Colombia, disponible en{" "}
        <a href="https://prime-growth-os.vercel.app" className="text-violet-400 hover:text-violet-300 underline">
          prime-growth-os.vercel.app
        </a>
        . Al crear una cuenta o usar la plataforma, aceptas estos Términos.
      </p>

      <LegalSection title="1. Descripción del servicio">
        <p>
          PRIME GROWTH OS es una plataforma asistida por inteligencia artificial que ayuda a pequeñas y medianas
          empresas a analizar su negocio, generar estrategias y textos de marketing, crear creativos publicitarios, y
          crear y gestionar campañas en Meta Ads (Facebook e Instagram). El servicio incluye, entre otras
          funcionalidades, un chat con un copiloto de marketing con IA, generación de imágenes publicitarias, y un CRM
          básico para el seguimiento de clientes potenciales.
        </p>
        <p>
          El servicio se ofrece &ldquo;tal cual&rdquo; y puede cambiar, expandirse o discontinuarse parcial o
          totalmente en cualquier momento.
        </p>
      </LegalSection>

      <LegalSection title="2. Uso aceptable de la plataforma">
        <p>Al usar PRIME GROWTH OS, te comprometes a:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>Usar la plataforma solo para fines lícitos y conforme a la legislación aplicable.</li>
          <li>
            Cumplir con las Políticas de Publicidad de Meta y los Términos de la Plataforma de Meta al crear o
            gestionar campañas a través de nuestra integración.
          </li>
          <li>No usar la plataforma para promocionar contenido ilegal, fraudulento, engañoso o discriminatorio.</li>
          <li>
            No intentar vulnerar, sobrecargar o interferir con el funcionamiento normal de la plataforma o de sus
            integraciones (Meta, OpenAI, Anthropic, Supabase).
          </li>
          <li>No usar credenciales, tokens o accesos que no te pertenezcan o que no estés autorizado a usar.</li>
        </ul>
        <p>
          Nos reservamos el derecho de suspender o cancelar el acceso de cualquier cuenta que incumpla estas
          condiciones.
        </p>
      </LegalSection>

      <LegalSection title="3. Integración con Meta Ads">
        <p>
          PRIME GROWTH OS te permite conectar tu cuenta de Meta (Facebook) Ads mediante el inicio de sesión oficial de
          Facebook. Al conectar tu cuenta, autorizas explícitamente a PRIME GROWTH OS a, en tu nombre y dentro de los
          permisos que apruebes durante ese proceso:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>Leer información de tu página de Facebook y de tu cuenta publicitaria.</li>
          <li>Crear campañas publicitarias en tu cuenta, basadas en sugerencias generadas por IA que tú apruebas.</li>
          <li>Activar o pausar, a tu solicitud, las campañas creadas a través de la plataforma.</li>
        </ul>
        <p>
          <span className="text-white font-medium">Eres el único responsable</span> de las campañas que apruebas,
          lanzas, activas o pausas a través de PRIME GROWTH OS, así como de cualquier gasto publicitario, resultado o
          consecuencia derivada de ellas en tu cuenta de Meta Ads. Las sugerencias de campaña generadas por IA son
          recomendaciones — revísalas antes de aprobarlas. Puedes revocar el acceso de PRIME GROWTH OS a tu cuenta de
          Meta en cualquier momento desde la configuración de tu cuenta de Facebook o solicitándonoslo directamente; al
          revocar el acceso, dejaremos de poder leer o modificar tu cuenta publicitaria.
        </p>
      </LegalSection>

      <LegalSection title="4. Cuentas de usuario">
        <p>
          Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad que
          ocurra bajo tu cuenta. Notifícanos de inmediato si sospechas de un acceso no autorizado.
        </p>
      </LegalSection>

      <LegalSection title="5. Propiedad intelectual">
        <p>
          El contenido generado por la IA (análisis, textos, imágenes) a partir de tu información se te entrega para
          tu uso en tus propias campañas de marketing. PRIME GROWTH OS, su marca, diseño y código permanecen como
          propiedad de su desarrollador.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitación de responsabilidad">
        <p>
          PRIME GROWTH OS se ofrece &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;, sin garantías de
          ningún tipo, expresas o implícitas. No garantizamos resultados específicos de marketing, ventas, leads,
          retorno de inversión publicitaria, ni la disponibilidad ininterrumpida del servicio.
        </p>
        <p>
          En la máxima medida permitida por la ley, no seremos responsables por daños indirectos, incidentales o
          consecuentes (incluyendo pérdida de ingresos, datos o gasto publicitario) derivados del uso de la
          plataforma, ni por fallas, cambios o interrupciones en servicios de terceros que usamos (Meta, OpenAI,
          Anthropic, Clerk, Supabase, Vercel). Nuestra responsabilidad total frente a ti, en cualquier caso, se limita
          al monto que hayas pagado por el servicio en los últimos tres meses, o a cero si el servicio fue gratuito.
        </p>
      </LegalSection>

      <LegalSection title="7. Modificaciones y terminación">
        <p>
          Podemos modificar estos Términos en cualquier momento; los cambios significativos se reflejarán con una
          nueva fecha de actualización al inicio de esta página. Puedes dejar de usar la plataforma y solicitar la
          eliminación de tu cuenta en cualquier momento.
        </p>
      </LegalSection>

      <LegalSection title="8. Ley aplicable">
        <p>Estos Términos se rigen por las leyes de la República de Colombia.</p>
      </LegalSection>

      <LegalSection title="9. Contacto">
        <p>Para preguntas sobre estos Términos, contáctanos en:</p>
        <p>
          <span className="text-white font-medium">Juan Carlos Caro Sierra</span>
          <br />
          Medellín, Colombia
          <br />
          <a href="mailto:juancarloscarosierra@gmail.com" className="text-violet-400 hover:text-violet-300 underline">
            juancarloscarosierra@gmail.com
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  )
}
