import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <h2>Campus Flow</h2>
     <img src="https://res.cloudinary.com/dhsqoyfgg/image/upload/v1772719858/campus-flow/users/BZndQZGXzMG7Lb4O2dFcJYXp40zrqw3g/documents/wvt7fuetaehx1wovadke.jpg" alt="" />
    </div>
  );
}
