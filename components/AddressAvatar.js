import { useMemo } from "react";
import { minifyAddress } from "../helpers";

function AddressAvatar({ address }) {
  const shortAddress = useMemo(() => minifyAddress(address), [address]);

  return (
    <div className="active:scale-95 transition-all flex justify-center font-title items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-purpleGlow text-primary px-6 py-1 text-sm" >
      {/* <img src="./polygonlogo.png" className="w-7 h-5 pr-2" /> */}
      <span>{shortAddress}</span>
    </div>
  );
}

export default AddressAvatar;
