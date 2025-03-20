export default function Card({ title, description }) {
  return (
    <div className="bg-[#3A2A1E] p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold text-[#D4A017] mb-2">{title}</h3>
      <p className="text-[#E8D5B5]">{description}</p>
    </div>
  );
}