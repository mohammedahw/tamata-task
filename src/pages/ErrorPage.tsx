import Navbar from "../components/Navbar";

export default function ErrorPage() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen text-2xl text-slate-600">
        404 - Page Not Found
      </div>
    </>
  );
}
