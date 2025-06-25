import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bus, MapPin, Clock, Users, Shield, CheckCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
            <Bus className="w-4 h-4 mr-2" />
            Empresa de Transporte Público
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-blue-800">Sobre Santa Catalina S.A.</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Más de dos décadas conectando Lima con un servicio de transporte público confiable, seguro y comprometido
            con nuestra comunidad.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Desde hace más de 20 años, Santa Catalina S.A. ha sido un pilar fundamental en el sistema de
                    transporte público de Lima, conectando comunidades y facilitando la movilidad de miles de limeños
                    cada día.
                  </p>
                  <p>
                    Operamos rutas estratégicas como la 3806, 8519 y 8520, cubriendo más de 240 paradas oficiales y
                    abarcando los principales corredores de la ciudad.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-800 mb-2">20+</div>
                    <div className="text-sm text-gray-600">Años de Experiencia</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-800 mb-2">240+</div>
                    <div className="text-sm text-gray-600">Paradas Oficiales</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-800 mb-2">38</div>
                    <div className="text-sm text-gray-600">Kilómetros de Cobertura</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-800 mb-2">3</div>
                    <div className="text-sm text-gray-600">Rutas Principales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Route */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ruta Destacada: 23B</h2>
            <p className="text-gray-600">
              Nuestra ruta más emblemática conecta San Juan de Lurigancho con Villa María del Triunfo
            </p>
          </div>

          <Card noPadding className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Bus className="w-8 h-8" />
                Ruta 23B (Ruta B)
              </CardTitle>
              <CardDescription className="text-blue-100">
                La columna vertebral del transporte en Lima Este y Sur
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Recorrido</h3>
                  <p className="text-gray-600">San Juan de Lurigancho - Villa María del Triunfo</p>
                </div>
                <div className="text-center">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Distancia</h3>
                  <p className="text-gray-600">38 kilómetros de recorrido total</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Impacto</h3>
                  <p className="text-gray-600">Miles de pasajeros diarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los principios que guían nuestro compromiso con el servicio de transporte público
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Seguridad",
                description:
                  "Cumplimos con todos los estándares de seguridad establecidos por las autoridades competentes.",
              },
              {
                icon: CheckCircle,
                title: "Confiabilidad",
                description: "Servicio constante y puntual para que puedas planificar tu día con tranquilidad.",
              },
              {
                icon: Award,
                title: "Calidad",
                description: "Mejora continua en nuestros servicios para brindar la mejor experiencia de viaje.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulation Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Regulación y Cumplimiento</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Estamos orgullosos de operar bajo la supervisión y regulación de las principales autoridades de transporte
              de Lima, garantizando un servicio que cumple con los más altos estándares de calidad y seguridad.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Municipalidad de Lima</h3>
                  <p className="text-gray-600 text-sm">Regulación municipal y permisos de operación</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">ATU</h3>
                  <p className="text-gray-600 text-sm">Autoridad de Transporte Urbano para Lima y Callao</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}