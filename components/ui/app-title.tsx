import { LeafyGreen } from "lucide-react";

export const AppTitle = () => (
  <section className="w-full justify-center text-center mt-5 mb-10">
    <h1 className="text-4xl font-medium">
      <LeafyGreen
        color="#1F8A70"
        strokeWidth={3}
        size={30}
        className="inline"
      />{" "}
      cabbage.io
    </h1>
    <p className="mt-2 text-sm">Leafy inventory app for managing item lists</p>
  </section>
);

export default AppTitle;
