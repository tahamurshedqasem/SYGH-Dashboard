"use client";

import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">📊 Card 1</div>
        <div className="bg-white p-6 rounded shadow">📈 Card 2</div>
        <div className="bg-white p-6 rounded shadow">📚 Card 3</div>
      </div>
    </Layout>
  );
}
