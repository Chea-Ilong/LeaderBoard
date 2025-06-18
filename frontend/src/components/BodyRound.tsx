import Image from "next/image";

export default function BodyRound() {
  return (
    <div className="bg-white text-slate-800 text-center grid grid-rows-1 grid-cols-12 gap-2 overflow-auto">
      <div>
        <div>#1</div>
        <Image src="/chealean.png" alt="Profile" width={50} height={50} />
        <div>Chheang Sovanpanha</div>
      </div>
      <div className="grid grid-cols-6 gap-0.5 -mt-0.5 bg-orange-400 font-bold rounded-md">
        {[1, 2, 3, 4, 5, 6].map((_, i) => {
          return (
            <div key={i} className="flex justify-center items-center">
              <div className="text-center mx-auto">{i + 1}</div>
              {i !== 5 && <div className="bg-white w-0.5 h-full ml-auto"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
