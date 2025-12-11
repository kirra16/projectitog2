import React from 'react';

const HallsTable = ({ halls }) => {
  return (
    <section id="table" className="table-section">
      <div className="table">
        <table>
          <caption>Информация о каждом зале</caption>
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Вместительность</th>
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