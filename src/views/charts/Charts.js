/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';

const Charts = () => {
  const random = () => Math.round(Math.random() * 100)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Commandes',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchCommandes = async () => {
      const commandesRef = collection(fire, 'commande');
      const commandesSnapshot = await getDocs(commandesRef);
      const productCounts = {};
      const dailySums = {};

      commandesSnapshot.forEach((doc) => {
        const commande = doc.data();
        const date = commande.commandeDate.toDate().toISOString().split('T')[0];
        dailySums[date] = (dailySums[date] || 0) + commande.totalPrice;

        commande.products.forEach((product) => {
          productCounts[product.id] = (productCounts[product.id] || 0) + 1;
        });
      });

      const productLabels = [];
      const productData = [];
      const backgroundColors = [];
      for (const [productId, count] of Object.entries(productCounts)) {
        const productRef = doc(fire, 'products', productId);
        const productSnap = await getDoc(productRef);
        const productName = productSnap.exists() ? productSnap.data().name : 'Unknown Product';
        productLabels.push(productName);
        productData.push(count);
        backgroundColors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
      }

      setChartData({
        labels: productLabels,
        datasets: [
          {
            data: productData,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
          },
        ],
      });

      const sortedDates = Object.keys(dailySums).sort();
      const sortedSums = sortedDates.map(date => dailySums[date]);
      setBarChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'Total Commandes',
            backgroundColor: '#f87979',
            data: sortedSums,
          },
        ],
      });
    };

    fetchCommandes();
  }, []);
  const [gouvernoratChartData, setGouvernoratChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Commandes par gouvernorat',
        backgroundColor: '#36A2EB',
        data: [],
      },
    ],
  });
  
  useEffect(() => {
    const fetchCommandes = async () => {
      const commandesRef = collection(fire, 'commande');
      const commandesSnapshot = await getDocs(commandesRef);
      const productCounts = {};
      const dailySums = {};
      const gouvernoratCounts = {};
  
      for (const docSnapshot of commandesSnapshot.docs) {
        const commande = docSnapshot.data();
        const date = commande.commandeDate.toDate().toISOString().split('T')[0];
        dailySums[date] = (dailySums[date] || 0) + commande.totalPrice;
  
        commande.products.forEach((product) => {
          productCounts[product.id] = (productCounts[product.id] || 0) + 1;
        });
  
        const userRef = doc(fire, 'users', commande.userId);
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();
        const gouvernorat = user.gouvernorat;
        gouvernoratCounts[gouvernorat] = (gouvernoratCounts[gouvernorat] || 0) + 1;
      }
  
      // Set chart data for products
      const productLabels = Object.keys(productCounts);
      const productData = Object.values(productCounts);
      const backgroundColors = productLabels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
      setChartData({
        labels: productLabels,
        datasets: [
          {
            data: productData,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
          },
        ],
      });
  
      // Set chart data for daily sums
      const sortedDates = Object.keys(dailySums).sort();
      const sortedSums = sortedDates.map(date => dailySums[date]);
      setBarChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'Total Commandes',
            backgroundColor: '#f87979',
            data: sortedSums,
          },
        ],
      });
  
      // Set chart data for gouvernorats
      const sortedGouvernorats = Object.keys(gouvernoratCounts).sort((a, b) => gouvernoratCounts[b] - gouvernoratCounts[a]);
      const sortedGouvernoratCounts = sortedGouvernorats.map(gouvernorat => gouvernoratCounts[gouvernorat]);
      setGouvernoratChartData({
        labels: sortedGouvernorats,
        datasets: [
          {
            label: 'Commandes par gouvernorat',
            backgroundColor: '#36A2EB',
            data: sortedGouvernoratCounts,
          },
        ],
      });
    };
  
    fetchCommandes();
  }, []);
  
  return (
    <CRow>
      
      
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar data={barChartData} labels="days" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
  <CCard className="mb-4">
    <CCardHeader>Bar Chart - Gouvernorats</CCardHeader>
    <CCardBody>
      <CChartBar data={gouvernoratChartData} labels="gouvernorats" />
    </CCardBody>
  </CCard>
</CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>Pie Chart</CCardHeader>
        <CCardBody>
          <CChartPie data={chartData} />
        </CCardBody>
      </CCard>
    </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Polar Area Chart</CCardHeader>
          <CCardBody>
            <CChartPolarArea
              data={{
                labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
                datasets: [
                  {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Radar Chart</CCardHeader>
          <CCardBody>
            <CChartRadar
              data={{
                labels: [
                  'Eating',
                  'Drinking',
                  'Sleeping',
                  'Designing',
                  'Coding',
                  'Cycling',
                  'Running',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                    data: [65, 59, 90, 81, 56, 55, 40],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                    data: [28, 48, 40, 19, 96, 27, 100],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
