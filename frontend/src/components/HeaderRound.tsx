export default function HeaderRound() {
  return (
    <div className="text-white text-center grid grid-rows-1 grid-cols-12 gap-2 overflow-auto">
      <div className="col-span-1 flex justify-center items-center bg-orange-400 font-bold rounded-md">Rank</div>
      <div className="col-span-3 flex justify-center items-center bg-orange-400 font-bold rounded-md">Full Name</div>
      <div className="col-span-1 flex justify-center items-center bg-orange-400 font-bold rounded-md">Group</div>
      <div className="col-span-4 flex-col justify-center items-center">
        <div className="text-slate-800 font-bold bg-white rounded-md">Questions</div>
        <div className="grid grid-cols-6 gap-0.5 -mt-0.5 bg-orange-400 font-bold rounded-md">
          {[1, 2, 3, 4, 5 , 6].map((_, i) => {
            return (
              <div key={i} className="flex justify-center items-center">
                <div className="text-center mx-auto">{i + 1}</div>
                {i !== 5 && <div className="bg-white w-0.5 h-full ml-auto"></div>}
              </div>
            )
          })}
        </div>
      </div>
      <div className="col-span-2 flex justify-center items-center bg-orange-400 font-bold rounded-md">Bonus</div>
      <div className="col-span-1 flex justify-center items-center bg-orange-400 font-bold rounded-md">Total</div>
    </div>
  );
}
