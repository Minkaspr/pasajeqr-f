
export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-100 to-white py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-800 mb-4">Bienvenido a Santa Catalina S.A.</h1>
        <p className="text-xl text-gray-700">Conectando Lima con responsabilidad y compromiso.</p>
      </section>

      <section className="py-16 px-4 text-center bg-white  mx-auto container">
        <h2 className="text-3xl font-semibold mb-6">Rutas Destacadas</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { ruta: "3806", desde: "San Juan de Lurigancho", hasta: "Miraflores" },
            { ruta: "8519", desde: "Villa María del Triunfo", hasta: "Lima" },
            { ruta: "8520", desde: "Villa El Salvador", hasta: "Lima" },
          ].map(({ ruta, desde, hasta }) => (
            <div key={ruta} className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md">
              <h3 className="text-xl font-bold mb-2">Ruta {ruta}</h3>
              <p className="text-gray-700">{desde} - {hasta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Contáctanos</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          ¿Tienes alguna consulta sobre nuestras rutas o servicios? Estamos aquí para ayudarte.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Escríbenos
        </button>
      </section>
    </main>
  );
}
