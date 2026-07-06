import { LegalPage, LegalSection } from "@/components/legal-page"

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidad" lastUpdated="5 de julio de 2026">
      <p className="text-gray-300 text-sm leading-relaxed">
        Esta política describe cómo PRIME GROWTH OS (&ldquo;nosotros&rdquo;, &ldquo;la plataforma&rdquo;), un producto
        desarrollado por Juan Carlos Caro Sierra en Medellín, Colombia, recopila, usa, almacena y protege tu
        información cuando usas{" "}
        <a href="https://primegrowth.com.co" className="text-violet-400 hover:text-violet-300 underline">
          primegrowth.com.co
        </a>
        , incluyendo cuando conectas tu cuenta de Meta (Facebook) Ads.
      </p>

      <LegalSection title="1. Qué datos recopilamos">
        <p>Recopilamos los siguientes tipos de información:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <span className="text-white font-medium">Datos de cuenta:</span> nombre y correo electrónico, gestionados a
            través de nuestro proveedor de autenticación (Clerk) cuando creas una cuenta.
          </li>
          <li>
            <span className="text-white font-medium">Datos de tu cuenta de Facebook/Meta:</span> cuando conectas tu
            cuenta de Meta Ads, recibimos el nombre, categoría, descripción y número de seguidores de tu página de
            Facebook, así como el nombre, moneda y zona horaria de tu cuenta publicitaria. Solo accedemos a esta
            información después de que la autorizas explícitamente a través del flujo oficial de inicio de sesión de
            Facebook (OAuth).
          </li>
          <li>
            <span className="text-white font-medium">Información de tu negocio:</span> la información que nos
            describes sobre tu negocio (industria, presupuesto, objetivos), y el análisis, las estrategias y los
            textos publicitarios que nuestra inteligencia artificial genera a partir de esa información.
          </li>
          <li>
            <span className="text-white font-medium">Datos de clientes potenciales (leads):</span> si usas nuestro CRM
            o nuestros formularios de captación, almacenamos el nombre, correo, teléfono y notas de las personas que
            tú registras como clientes potenciales.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Uso de la Meta Marketing API">
        <p>
          PRIME GROWTH OS se integra con la API de Marketing de Meta (Meta Marketing API) para ayudarte a gestionar
          tus campañas publicitarias de Facebook e Instagram. Concretamente, usamos esta integración para:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>Leer información básica de tu página de Facebook y tu cuenta publicitaria.</li>
          <li>Generar, con inteligencia artificial, sugerencias de campañas basadas en esa información.</li>
          <li>Crear campañas reales en tu cuenta publicitaria cuando tú apruebas explícitamente una sugerencia.</li>
          <li>Activar o pausar, a tu solicitud, las campañas que creaste a través de la plataforma.</li>
        </ul>
        <p>
          Nunca creamos, modificamos, activamos ni pausamos ninguna campaña sin una acción explícita de tu parte.
          PRIME GROWTH OS no publica contenido en tu página ni accede a tus mensajes o publicaciones.
        </p>
      </LegalSection>

      <LegalSection title="3. Cómo almacenamos los tokens de acceso de Meta">
        <p>
          Cuando autorizas la conexión con Meta, recibimos un token de acceso (de hasta ~60 días de duración) que nos
          permite actuar en tu nombre dentro de los límites que tú aprobaste. Este token:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            Se almacena cifrado en tránsito y en reposo en nuestra base de datos (Supabase/PostgreSQL), en una tabla
            con seguridad a nivel de fila (Row Level Security) sin políticas públicas.
          </li>
          <li>
            Solo es accesible desde nuestros servidores, usando una credencial de servicio que nunca se expone al
            navegador ni al cliente — en ningún momento el token viaja a tu dispositivo después de guardarse.
          </li>
          <li>Nunca almacenamos tu contraseña de Facebook/Meta — solo el token OAuth que Meta nos entrega.</li>
          <li>No compartimos, vendemos ni transferimos este token a terceros bajo ninguna circunstancia.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Tus derechos">
        <p>Sin importar dónde te encuentres, tienes derecho a:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            <span className="text-white font-medium">Revocar el acceso a tu cuenta de Meta</span> en cualquier
            momento, ya sea desde Facebook (Configuración → Aplicaciones y sitios web) o solicitándonoslo
            directamente.
          </li>
          <li>
            <span className="text-white font-medium">Solicitar la eliminación</span> de tus datos de cuenta, tu
            información de negocio y los tokens almacenados. Ver sección 5 para el procedimiento exacto.
          </li>
          <li>
            <span className="text-white font-medium">Solicitar una copia</span> de los datos que tenemos sobre ti.
          </li>
          <li>
            <span className="text-white font-medium">Corregir</span> información inexacta asociada a tu cuenta.
          </li>
        </ul>
        <p>
          Atendemos estas solicitudes en un plazo razonable después de recibirlas por el canal de contacto indicado
          abajo. Revocar el acceso desde Facebook no elimina automáticamente los datos ya almacenados en nuestra base
          de datos — para eso, escríbenos directamente siguiendo el procedimiento de la sección 5.
        </p>
      </LegalSection>

      <LegalSection id="eliminacion-de-datos" title="5. Cómo solicitar la eliminación de tus datos">
        <p>
          Puedes solicitar en cualquier momento la eliminación completa de los datos que tenemos asociados a tu cuenta.
          Esto incluye, sin limitarse a:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>Tu información de cuenta (nombre, correo electrónico).</li>
          <li>La información de tu negocio y el historial de análisis generado por la IA.</li>
          <li>
            Los tokens de acceso de Meta/Facebook almacenados en nuestros servidores, incluyendo cualquier dato
            obtenido a través de la integración con la API de Meta (nombre de página, datos de cuenta publicitaria,
            etc.).
          </li>
          <li>Tus sugerencias de campañas e historial de campañas lanzadas.</li>
          <li>Los datos de clientes potenciales (leads) que hayas registrado en el CRM.</li>
        </ul>
        <p>
          <span className="text-white font-medium">Esta sección aplica específicamente también a los datos
          obtenidos mediante la integración con Meta/Facebook Ads.</span> Si desconectaste tu cuenta de Meta desde
          Facebook pero tus datos siguen almacenados en nuestros servidores, este es el procedimiento para
          eliminarlos.
        </p>
        <p className="text-white font-medium">Para solicitar la eliminación, sigue estos pasos:</p>
        <ol className="list-decimal list-inside space-y-2 pl-1">
          <li>
            Envía un correo electrónico a{" "}
            <a href="mailto:soporte@primegrowth.com.co" className="text-violet-400 hover:text-violet-300 underline">
              soporte@primegrowth.com.co
            </a>{" "}
            con el asunto: <span className="text-white font-medium">&ldquo;Solicitud de eliminación de datos — PRIME GROWTH OS&rdquo;</span>.
          </li>
          <li>
            Incluye en el cuerpo del correo el correo electrónico con el que te registraste en la plataforma, y
            confirma que deseas eliminar todos tus datos (o especifica cuáles deseas eliminar).
          </li>
          <li>
            Procesaremos tu solicitud en un plazo máximo de <span className="text-white font-medium">30 días hábiles</span>{" "}
            y te confirmaremos por correo electrónico una vez completada la eliminación.
          </li>
        </ol>
        <p>
          Una vez eliminados, los datos no podrán recuperarse. Si decides volver a usar la plataforma en el futuro,
          deberás crear una cuenta nueva.
        </p>
      </LegalSection>

      <LegalSection title="6. Contacto para solicitudes de privacidad">
        <p>
          Para ejercer cualquiera de los derechos anteriores, o si tienes preguntas sobre esta política, contáctanos
          en:
        </p>
        <p>
          <span className="text-white font-medium">Juan Carlos Caro Sierra</span>
          <br />
          Medellín, Colombia
          <br />
          <a href="mailto:soporte@primegrowth.com.co" className="text-violet-400 hover:text-violet-300 underline">
            soporte@primegrowth.com.co
          </a>
        </p>
      </LegalSection>

      <LegalSection title="7. Cumplimiento con las políticas de la Plataforma Meta">
        <p>
          El uso que hacemos de las APIs de Meta cumple con los Términos de la Plataforma de Meta y las Políticas para
          Desarrolladores de Meta. En particular:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-1">
          <li>
            Solo solicitamos los permisos necesarios para el funcionamiento de la plataforma (gestión y lectura de
            anuncios, gestión de negocio, y lectura de páginas), y los pedimos de forma explícita durante el inicio de
            sesión con Facebook.
          </li>
          <li>No usamos los datos obtenidos de Meta para ningún propósito distinto a los descritos en esta política.</li>
          <li>No vendemos ni transferimos datos de usuarios de Meta a terceros, anunciantes o intermediarios de datos.</li>
          <li>
            Atendemos las solicitudes de eliminación de datos de usuario conforme a los requisitos de la Plataforma de
            Meta. El procedimiento específico está detallado en la sección 5 de esta política.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Cambios a esta política">
        <p>
          Podemos actualizar esta política ocasionalmente para reflejar cambios en la plataforma o en requisitos
          legales o de Meta. Si hacemos cambios significativos, actualizaremos la fecha al inicio de esta página.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
