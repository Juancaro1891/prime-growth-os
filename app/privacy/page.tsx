import { LegalPage, LegalSection } from "@/components/legal-page"

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidad" lastUpdated="22 de junio de 2026">
      <p className="text-gray-300 text-sm leading-relaxed">
        Esta política describe cómo PRIME GROWTH OS (&ldquo;nosotros&rdquo;, &ldquo;la plataforma&rdquo;), un producto
        desarrollado por Juan Carlos Caro Sierra en Medellín, Colombia, recopila, usa, almacena y protege tu
        información cuando usas{" "}
        <a href="https://prime-growth-os.vercel.app" className="text-violet-400 hover:text-violet-300 underline">
          prime-growth-os.vercel.app
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
            información de negocio y los tokens almacenados.
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
          de datos — para eso, escríbenos directamente.
        </p>
      </LegalSection>

      <LegalSection title="5. Contacto para solicitudes de privacidad">
        <p>
          Para ejercer cualquiera de los derechos anteriores, o si tienes preguntas sobre esta política, contáctanos
          en:
        </p>
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

      <LegalSection title="6. Cumplimiento con las políticas de la Plataforma Meta">
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
            Meta.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Cambios a esta política">
        <p>
          Podemos actualizar esta política ocasionalmente para reflejar cambios en la plataforma o en requisitos
          legales o de Meta. Si hacemos cambios significativos, actualizaremos la fecha al inicio de esta página.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
