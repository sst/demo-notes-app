const containerCs =
  `pt-24 text-center`;
const titleCs =
  `text-3xl font-serif font-medium text-gray-700`;

export default function NotFound() {
  return (
    <div className={containerCs}>
      <h3 className={titleCs}>Sorry, page not found!</h3>
    </div>
  );
}
