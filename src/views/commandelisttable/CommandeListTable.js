/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';

const CommandeListTable = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const commandesRef = collection(fire, 'commande');
    onSnapshot(commandesRef, (snapshot) => {
      const commandeArray = [];
      snapshot.forEach((doc) => {
        const commandeData = doc.data();
        commandeData.id = doc.id; // Unique identifier
        commandeArray.push(commandeData);
      });
      setCommandes(commandeArray);
    });
  }, []);

  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Total Price</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>User ID</CTableHeaderCell>
            <CTableHeaderCell>Products</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {commandes.map((commande) => (
            <CTableRow key={commande.id}>
              <CTableDataCell>{commande.commandeDate?.toDate()?.toLocaleDateString() || 'N/A'}</CTableDataCell>
              <CTableDataCell>{commande.totalPrice} DT</CTableDataCell>
              <CTableDataCell>{commande.status || 'Pending'}</CTableDataCell>
              <CTableDataCell>{commande.userId}</CTableDataCell>
              <CTableDataCell>
                {commande.products.map((product, index) => (
                  <div key={index}>
                    {product.name} - {product.price} DT
                  </div>
                ))}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
};

export default CommandeListTable;
