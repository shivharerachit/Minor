
import { SplineScene } from "./Splite";
import { Card } from "./Card"; 
import { Spotlight } from "./Spotlight";
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-full bg-black/[0.96] fixed overflow-hidden bottom-0">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="yellow"
        
      />
      <div style={{minHeight:"100%"}} className="flex h-full ">
        {/* Left content */}
        <div className="  relative z-10 flex flex-col justify-center">
          {/* <h1 style={{color:"white",textAlign:"center",marginTop:"40px" ,fontFamily: "Orbitron, sans-serif" }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            AutoValuator
          </h1> */}
        </div>

        {/* Right content */}
        <div className="flex-1 relative bottom-0">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full fixed bottom-0"
          />
        </div>
      </div>
    </Card>
  );
}
