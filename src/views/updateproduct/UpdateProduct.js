/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import { fire, storage } from '../../components/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormTextarea,
  CImage,
  CInputGroup,
  CRow,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
const UpdateProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(fire, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
        setImagePreviews(docSnap.data().imageUrls || []);
      } else {
        console.log('No such document!');
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (images.length > 0) {
      const newImagePreviews = images.map((image) =>
        URL.createObjectURL(image)
      );
      setImagePreviews(newImagePreviews);
    }
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length > 0) {
      const imageUrls = [];
      for (const image of images) {
        const imageRef = ref(storage, `products/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl);
      }
      product.imageUrls = imageUrls;
    }

    try {
      const docRef = doc(fire, 'products', productId);
      await updateDoc(docRef, product);
      toast.success('Produit mis à jour avec succès !');
      navigate('/listproduct'); // Navigate to ListProduct page
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit : ", error);
      toast.error(`Erreur lors de la mise à jour du produit : ${error.message}`);
    }
  };
  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <CContainer>
        <CCard>
          <CCardBody>
            <h4>Modifier le produit</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Nom du produit"
                      name="name"
                      value={product.name || ''}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="number"
                      placeholder="Prix"
                      name="price"
                      value={product.price || ''}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Volume"
                      name="volume"
                      value={product.volume || ''}
                      onChange={(e) => setProduct({ ...product, volume: e.target.value })}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Désignation"
                      name="designation"
                      value={product.designation || ''}
                      onChange={(e) => setProduct({ ...product, designation: e.target.value })}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Propriétés cosmétiques"
                      name="propertiesCosmetics"
                      value={product.propertiesCosmetics || ''}
                      onChange={(e) => setProduct({ ...product, propertiesCosmetics: e.target.value })}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormTextarea
                      placeholder="Description"
                      name="description"
                      value={product.description || ''}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files))}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <div className="image-previews">
                    {imagePreviews.map((imageUrl, index) => (
                      <CImage
                        key={index}
                        src={imageUrl}
                        alt="Product Image"
                        height={100}
                        className="me-2"
                      />
                    ))}
                  </div>
                </CCol>
              </CRow>
              <CButton
                color="primary"
                type="submit"
                style={{
                  marginTop: '20px',
                  backgroundColor: 'red',
                  color: 'white',
                }}
              >
                Modifier le produit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default UpdateProductForm;


