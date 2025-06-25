"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bus, MapPin, Clock, Users, Star, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {

  const [healthStatus, setHealthStatus] = useState("");

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`);
        const text = await res.text();
        setHealthStatus(text); // Esto será "OK 👌"
      } catch (error) {
        console.error("Error al verificar el estado del servidor:", error);
        setHealthStatus("Servidor no disponible ❌");
      }
    }

    checkHealth();
  }, []);

  return (
    <main className="min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Bus className="w-4 h-4 mr-2" />
              Más de 20 años de experiencia
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Conectando Lima con
              <span className="block text-blue-200">responsabilidad</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Somos Santa Catalina S.A., tu empresa de confianza en transporte público urbano
            </p>
            {healthStatus && (
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-100 px-4 py-2 rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Estado del servicio: {healthStatus}
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Bus, number: "3", label: "Rutas Principales" },
              { icon: MapPin, number: "240+", label: "Paradas Oficiales" },
              { icon: Clock, number: "20+", label: "Años de Servicio" },
              { icon: Users, number: "1000+", label: "Pasajeros Diarios" },
            ].map(({ icon: Icon, number, label }, index) => (
              <div key={index} className="group">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
                <div className="text-gray-600 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routes Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Rutas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conectamos los principales distritos de Lima con rutas eficientes y seguras
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                ruta: "3806",
                desde: "San Juan de Lurigancho",
                hasta: "Miraflores",
                distancia: "25 km",
                tiempo: "45 min",
                destacada: true,
              },
              {
                ruta: "8519",
                desde: "Villa María del Triunfo",
                hasta: "Lima Centro",
                distancia: "18 km",
                tiempo: "35 min",
                destacada: false,
              },
              {
                ruta: "8520",
                desde: "Villa El Salvador",
                hasta: "Lima Centro",
                distancia: "22 km",
                tiempo: "40 min",
                destacada: false,
              },
            ].map(({ ruta, desde, hasta, distancia, tiempo, destacada }) => (
              <Card
                key={ruta}
                className={`group hover:shadow-xl transition-all duration-300 ${destacada ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-blue-800">Ruta {ruta}</CardTitle>
                    {destacada && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{desde}</div>
                      <div className="text-sm text-gray-500">hasta {hasta}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Bus className="w-4 h-4" />
                      {distancia}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tiempo}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">¿Necesitas ayuda?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Nuestro equipo está disponible para resolver tus consultas sobre rutas, horarios y servicios
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Línea de Atención</h3>
                <p className="text-blue-100">Lunes a Viernes: 6:00 AM - 10:00 PM</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Correo Electrónico</h3>
                <p className="text-blue-100">Respuesta en menos de 24 horas</p>
              </div>
            </div>

            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
              Contáctanos Ahora
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
