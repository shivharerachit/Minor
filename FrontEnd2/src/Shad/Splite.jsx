import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-full flex items-center justify-center fixed left-0">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{minHeight:"300px",zIndex:"30",position:"fixed", marginBottom:"-20px", alignContent:"center", alignItems:"center"}}
      />
    </Suspense>
  );
}