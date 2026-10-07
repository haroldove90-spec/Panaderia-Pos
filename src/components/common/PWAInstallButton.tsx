import React, { useState } from 'react';
import { Download, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // If already running in standalone PWA mode
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {!compact && <span>App Instalada</span>}
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGeneralGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        title="Instalar aplicación en tu dispositivo"
        className="flex items-center gap-2 rounded-xl bg-[#C58847] hover:bg-[#562914] active:scale-95 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span className={compact ? 'hidden md:inline' : 'inline'}>Instalar</span>
      </button>

      {/* iOS Modal instructions */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCF1D5] flex items-center justify-center text-[#562914]">
                <Smartphone className="w-5 h-5 text-[#C58847]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#562914]">Instalar en iPhone o iPad</h3>
                <p className="text-xs text-stone-500">Panadería Pos PWA</p>
              </div>
            </div>

            <ol className="space-y-3 text-xs text-stone-700 mb-6 bg-[#FCF1D5]/40 p-3.5 rounded-xl border border-[#562914]/15">
              <li className="flex items-start gap-2">
                <span className="font-bold bg-[#C58847] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha arriba) en la barra de Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Baja y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold bg-amber-200 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Toca <strong>Agregar</strong> en la esquina superior derecha.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 text-sm transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* General Desktop/Android Browser fallback guide if beforeinstallprompt not yet fired */}
      {showGeneralGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">Instalar Panadería Pos</h3>
                <p className="text-xs text-stone-500">Computadora o Dispositivo Móvil</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <p>
                Para instalar la app como aplicación de escritorio o en Android:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Haz clic en el ícono de <strong>Instalar</strong> en la barra de direcciones de tu navegador (Chrome o Edge).</li>
                <li>O abre el menú de opciones (⋮) y selecciona <strong>"Instalar Panadería Pos"</strong>.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowGeneralGuide(false)}
              className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 text-sm transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
