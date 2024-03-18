/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config'; // Import your Firebase configuration
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';

const CommandeList = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      const commandesCollectionRef = collection(fire, 'commande');
      const commandesSnapshot = await getDocs(commandesCollectionRef);
      const commandesList = await Promise.all(commandesSnapshot.docs.map(async (docSnapshot) => {
        const commandeData = docSnapshot.data();
        const productsWithNames = commandeData.products && Array.isArray(commandeData.products) ? await Promise.all(commandeData.products.map(async (product) => {
          const productRef = doc(fire, 'products', product.id);
          const productSnap = await getDoc(productRef);
          const productName = productSnap.exists() ? productSnap.data().name : 'Unknown Product';
          return { name: productName, price: product.price };
        })) : [];
        return { id: docSnapshot.id, ...commandeData, products: productsWithNames };
      }));
      setCommandes(commandesList);
    };

    fetchCommandes();
  }, []);

  return (
    <CContainer>
      <h2>Liste des Commandes</h2>
      {commandes.map((commande) => (
        <CCard key={commande.id} className="mb-3">
          <CCardBody>
            <CCardTitle>Date: {commande.commandeDate?.toDate()?.toLocaleDateString() || 'N/A'}</CCardTitle>
            <p>Total: {commande.totalPrice} DT</p>
            <p>Produits:</p>
            <CListGroup>
              {commande.products.map((product, index) => (
                <CListGroupItem key={index}>
                  {product.name} - {product.price} DT
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCardBody>
        </CCard>
      ))}
    </CContainer>
  );
};

export default CommandeList;





