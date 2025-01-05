import React, { useState } from "react";
import CardRow from "./CardRow"; // Assure-toi que le chemin est correct

// Définir le type pour une carte (Card)
type Card = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  status: string;
};

// Type des props pour le composant Table
type TableProps = {
  cards: Card[];
};

const Table = ({ cards }: TableProps) => {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Par défaut, 5 lignes par page

  // Calculer l'index de début et de fin des cartes pour la page actuelle
  const indexOfLastCard = currentPage * rowsPerPage;
  const indexOfFirstCard = indexOfLastCard - rowsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white flex flex-col my-5 p-4 border border-gray-100 rounded-xl shadow-md ">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white rounded-2xl border justify-start">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCards.map((card) => (
                  <CardRow key={card.id} card={card} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 ">
        <div>
          <span className="text-sm text-gray-700">
            Rows per page:
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="ml-2 border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-700">
            {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, cards.length)} of {cards.length}
          </span>
        </div>
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            &lt;
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCard >= cards.length}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
