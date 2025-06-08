'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContextUsuario } from "./Provider/ProviderUsuario";
import { useRouter } from "next/navigation";

export default function Home() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);

  const { nombreUsuario, setNombreUsuario, setClaveUsuario } = useContextUsuario();
  const route = useRouter();

  function login() {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      alert('Debe ingresar usuario y clave');
      return;
    }

    if (usuario === 'admin' && contrasena === 'admin123') {
      setNombreUsuario(usuario);
      setClaveUsuario(contrasena);
      route.push('/Dashboard'); 
    } else {
      alert('Usuario o Contraseña incorrecta ');
    }
  }

  useEffect(() => {
    console.log(nombreUsuario);
  }, [nombreUsuario]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/fondo-login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <main className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md text-black rounded-2xl shadow-xl p-8 sm:p-10 border border-white/30 flex flex-col items-center">
        <img src="/logo.png" alt="Logo Anadish" className="w-40 h-auto mb-4 drop-shadow-md" />

        <form className="w-full space-y-6">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-black mb-1">Usuario</label>
            <input
              type="text"
              id="usuario"
              className="w-full px-4 py-2 bg-white/20 text-black placeholder-white/60 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="clave" className="block text-sm font-medium text-black mb-1">Contraseña</label>
            <input
              type={mostrarClave ? "text" : "password"}
              id="clave"
              className="w-full px-4 py-2 bg-white/20 text-black placeholder-black/60 rounded-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <div className="mt-2 text-sm flex items-center gap-2 text-black/80">
              <input
                type="checkbox"
                id="verClave"
                checked={mostrarClave}
                onChange={() => setMostrarClave(!mostrarClave)}
              />
              <label htmlFor="verClave">Mostrar contraseña</label>
            </div>
          </div>
          
          <button
           type="button"
           onClick={login}
           className="w-full bg-white/10 hover:bg-white/20 text-black font-semibold py-2 rounded-md border border-white/30 transition duration-200 shadow-md backdrop-blur-sm">
            Iniciar Sesión
          </button>

        </form>
      </main>
    </div>
  );
}
