import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineScene({ scene, className }) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{minHeight:"300px",zIndex:"30",position:"relative",marginTop:"10px"}}
      />
    </Suspense>
  );
}