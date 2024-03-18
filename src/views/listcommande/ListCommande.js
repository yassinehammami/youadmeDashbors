/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config'; // Import your Firebase configuration
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CButton,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CommandeList = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      const commandesCollectionRef = collection(fire, 'commande');
      const commandesSnapshot = await getDocs(commandesCollectionRef);
      const commandesList = await Promise.all(commandesSnapshot.docs.map(async (docSnapshot) => {
        const commandeData = docSnapshot.data();
        if (commandeData.status) {
          return null; // Exclude commandes with a status field
        }
        const userRef = doc(fire, 'users', commandeData.userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : null;
        const { password, id, ...userDetails } = userData || {}; // Exclude password and id
        const productsWithNames = commandeData.products && Array.isArray(commandeData.products) ? await Promise.all(commandeData.products.map(async (product) => {
          const productRef = doc(fire, 'products', product.id);
          const productSnap = await getDoc(productRef);
          const productName = productSnap.exists() ? productSnap.data().name : 'Unknown Product';
          return { name: productName, price: product.price };
        })) : [];
        return { id: docSnapshot.id, ...commandeData, products: productsWithNames, user: userDetails };
      }));
      setCommandes(commandesList.filter(commande => commande !== null)); // Filter out null values
    };
    fetchCommandes();
  }, []);

  const updateStatus = async (commandeId, status) => {
    const commandeRef = doc(fire, 'commande', commandeId);
    try {
      await updateDoc(commandeRef, { status: status });
      setCommandes(commandes.filter(commande => commande.id !== commandeId)); // Remove the updated commande from the list
      toast.success(`Commande ${status === 'Confirmed' ? 'confirmée' : 'rejetée'} avec succès !`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande : ", error);
      toast.error(`Erreur lors de la mise à jour du statut de la commande : ${error.message}`);
    }
  };
  
  return (
    <CContainer>
         <ToastContainer />
      <h2>Liste des Commandes</h2>
      {commandes.map((commande) => (
        <CCard key={commande.id} className="mb-3">
          <CCardBody>
            <CCardTitle>Date: {commande.commandeDate?.toDate()?.toLocaleDateString() || 'N/A'}</CCardTitle>
            <p>Total: {commande.totalPrice} DT</p>
            <p>Client:</p>
            <ul>
              <li>Nom: {commande.user?.firstName} {commande.user?.lastName}</li>
              <li>Email: {commande.user?.email}</li>
              <li>Téléphone: {commande.user?.phone}</li>
              <li>Adresse: {commande.user?.address}, {commande.user?.city}, {commande.user?.gouvernorat}, {commande.user?.postalCode}</li>
            </ul>
            <p>Produits:</p>
            <CListGroup>
              {commande.products.map((product, index) => (
                <CListGroupItem key={index}>
                  {product.name} - {product.price} DT
                </CListGroupItem>
              ))}
            </CListGroup>
            <div className="mt-3">
              <CButton color="success" className="me-2" onClick={() => updateStatus(commande.id, 'Confirmed')}>
                Confirmer
              </CButton>
              <CButton color="danger" onClick={() => updateStatus(commande.id, 'Rejected')}>
                Rejeter
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </CContainer>
  );
};

export default CommandeList;


