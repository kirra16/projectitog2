import React from 'react';
import './HallsTable.css';

const HallsTable = ({ halls }) => {
  return (
    <section id="table" className="table-section content-section">
      <div className="table">
        <table>
          <caption>Доступные банкетные залы</caption>
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Вместимость</th>
              <th scope="col">Цена за час</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall) => (
              <tr key={hall.id}>
                <td>{hall.name}</td>
                <td>{hall.capacity}</td>
                <td>{hall.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HallsTable;
