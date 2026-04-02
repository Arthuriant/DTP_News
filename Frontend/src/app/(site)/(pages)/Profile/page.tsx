import ProfilePage from "@/components/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | UpToYou",
  description: "Halaman profil pengguna",
};

export default function Page() {
  return (
    <>
      <ProfilePage />
    </>
  );
}