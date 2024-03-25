/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [prevDayUsers, setPrevDayUsers] = useState(0); // Assume this is fetched from somewhere

  const [totalSales, setTotalSales] = useState(0);
  const [prevDaySales, setPrevDaySales] = useState(0); // Assume this is fetched from somewhere
  const [totalCommands, setTotalCommands] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    const fetchAverageOrderValue = async () => {
      const commandsRef = collection(fire, 'commande');
      const commandsSnapshot = await getDocs(commandsRef);
      let totalSales = 0;
      commandsSnapshot.forEach((doc) => {
        totalSales += doc.data().totalPrice;
      });
      const avgOrderValue = totalSales / commandsSnapshot.size;
      setAverageOrderValue(avgOrderValue);
    };
  
    fetchAverageOrderValue();
  }, []);
  
  useEffect(() => {
    const fetchCommands = async () => {
      const commandsRef = collection(fire, 'commande');
      const commandsSnapshot = await getDocs(commandsRef);
      setTotalCommands(commandsSnapshot.size);
    };
  
    fetchCommands();
  }, []);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersRef);
      setTotalUsers(usersSnapshot.size);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTotalSales = async () => {
      const commandeRef = collection(fire, 'commande');
      const q = query(commandeRef, where("status", "==", "Confirmed"));
      const commandeSnapshot = await getDocs(q);
      let total = 0;
      commandeSnapshot.forEach((doc) => {
        total += doc.data().totalPrice;
      });
      setTotalSales(total);
    };

    fetchTotalSales();
  }, []);

  const userPercentageChange = ((totalUsers - prevDayUsers) / prevDayUsers) * 100;
  const salesPercentageChange = ((totalSales - prevDaySales) / prevDaySales) * 100;

  return (
    <CRow>
    <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={`${totalUsers}`}
          title="Users"
          action={
            <span className="fs-6 fw-normal">
              {userPercentageChange.toFixed(1)}%{' '}
              {userPercentageChange >= 0 ? (
                <CIcon icon={cilArrowTop} className="text-success" />
              ) : (
                <CIcon icon={cilArrowBottom} className="text-danger" />
              )}
            </span>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: 'rgba(255,255,255,.55)',
                    data: [65, 59, 84, 84, 51, 55, 40], // Replace with your data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success"
          value={`$${totalSales}`}
          title="Total Sales"
          action={
            <span className="fs-6 fw-normal">
              {salesPercentageChange.toFixed(1)}%{' '}
              {salesPercentageChange >= 0 ? (
                <CIcon icon={cilArrowTop} className="text-success" />
              ) : (
                <CIcon icon={cilArrowBottom} className="text-danger" />
              )}
            </span>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Sales',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: 'rgba(255,255,255,.55)',
                    data: [65, 59, 84, 84, 51, 55, 40], // Replace with your sales data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
  <CWidgetStatsA
    className="mb-4"
    color="warning"
    value={`${totalCommands}`} // Display the total number of commands
    title="Total Commands"
    chart={
      <CChartLine
        className="mt-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Commands',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [78, 81, 80, 45, 34, 12, 40], // Replace with your commands data
              fill: true,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    }
  />
</CCol>


<CCol sm={6} lg={3}>
  <CWidgetStatsA
    className="mb-4"
    color="info"
    value={`$${averageOrderValue.toFixed(2)}`} // Display the average order value
    title="Average Order Value"
    chart={
      <CChartLine
        className="mt-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Average Order Value',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [50, 60, 70, 80, 90, 100, 110], // Replace with your average order value data
              fill: true,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    }
  />
</CCol>

    </CRow>
  )
}

export default WidgetsDropdown
