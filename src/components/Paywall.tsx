
const Paywall = ({ featureName }: { featureName: string }) => {
  return (
    <div className="text-center p-5">
      <h3 className="font-orbitron">Función Premium: {featureName}</h3>
      <p className="lead mt-3">Debido al alto costo computacional de la generación de imágenes, esta es una función que requiere un plan de pago en la plataforma de Google AI.</p>
      <p className="text-muted">Para usar esta función, necesitarías una clave de API con la facturación activada.</p>
      
      <div className="mt-4 col-lg-8 mx-auto">
        <label htmlFor="premium-api-key" className="form-label">Activar con tu propia Clave de API (Función Futura):</label>
        <input 
          type="text" 
          id="premium-api-key" 
          className="form-control text-center" 
          placeholder="Introduce tu clave de API de Google AI..." 
          disabled 
        />
        <div className="form-text">Esta funcionalidad para que los usuarios traigan su propia clave aún no está implementada.</div>
      </div>
    </div>
  );
};

export default Paywall;
