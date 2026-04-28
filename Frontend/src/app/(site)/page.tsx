import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Up To You | Custom Tas Kulit Eksklusif",
  description: "Wujudkan tas kulit impianmu di Up To You. Kami menghadirkan layanan kustomisasi tas premium dengan material kulit berkualitas tinggi dan desain elegan yang memukau.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}